
import { Drill, UserProgress, DrillAttempt, User, PmLevel } from '../types';
import * as dataService from './localDataService';

const DAILY_DRILL_LIMIT = 3;
const COOLDOWN_HOURS = 24;
const STREAK_WINDOW_HOURS = 36;

export interface DailyDrillStatus {
    drillsCompletedToday: number;
    drillsRemaining: number;
    cooldownEndTime: string | null;
    isUnlimited: boolean;
}

export const getDailyDrillStatus = (user: User, progress: UserProgress): DailyDrillStatus => {
    if (user.plan === 'Plus' || user.plan === 'Teams') {
        return {
            drillsCompletedToday: 0,
            drillsRemaining: Infinity,
            cooldownEndTime: null,
            isUnlimited: true,
        };
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - COOLDOWN_HOURS * 60 * 60 * 1000);

    // Filter completions to find the start of the current cycle
    const recentCompletions = progress.dailyDrillCompletions.filter(
        c => new Date(c.completedAt) > twentyFourHoursAgo
    );

    if (recentCompletions.length === 0) {
        return {
            drillsCompletedToday: 0,
            drillsRemaining: DAILY_DRILL_LIMIT,
            cooldownEndTime: null,
            isUnlimited: false,
        };
    }

    const firstDrillTime = new Date(recentCompletions.sort((a,b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())[0].completedAt);
    const cycleEndTime = new Date(firstDrillTime.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);

    // Count drills completed within the current active cycle
    const drillsInCycle = progress.dailyDrillCompletions.filter(c => new Date(c.completedAt) >= firstDrillTime).length;
    
    if (cycleEndTime <= now) {
         // Cycle is over, but some completions are recent. Start a new cycle.
         return {
            drillsCompletedToday: 0,
            drillsRemaining: DAILY_DRILL_LIMIT,
            cooldownEndTime: null,
            isUnlimited: false,
        };
    }

    const drillsRemaining = Math.max(0, DAILY_DRILL_LIMIT - drillsInCycle);

    return {
        drillsCompletedToday: drillsInCycle,
        drillsRemaining,
        cooldownEndTime: drillsRemaining === 0 ? cycleEndTime.toISOString() : null,
        isUnlimited: false,
    };
};


const getSpacedRepetitionInterval = (isCorrect: boolean, previousInterval: number = 0): number => {
    if (isCorrect) {
        // Exponential backoff for correct answers (e.g., 1 day, 3 days, 7 days, etc.)
        return Math.max(1, previousInterval * 2.5 + 1); 
    }
    // Reset for incorrect answers
    return 1; 
};

export const recordAttempt = (user: User, attempt: Omit<DrillAttempt, 'nextShowAt' | 'calibrationScore' | 'pmLevelAtAttempt'>) => {
    const progress = dataService.getUserProgress(user.id);
    const now = new Date();

    // --- Streak Logic (calculated before attempts array is modified) ---
    // 1. Session Streak (based on time between attempts)
    const chronologicallyLastAttempt = progress.attempts.length > 0
        ? [...progress.attempts].sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())[0]
        : null;

    if (chronologicallyLastAttempt) {
        const lastAttemptDate = new Date(chronologicallyLastAttempt.attemptedAt);
        const hoursSinceLast = (now.getTime() - lastAttemptDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLast < STREAK_WINDOW_HOURS) {
            progress.currentStreak += 1;
        } else {
            progress.currentStreak = 1;
        }
    } else {
        progress.currentStreak = 1;
    }
    progress.longestStreak = Math.max(progress.currentStreak, progress.longestStreak);

    // 2. Daily Streak (based on local calendar days for robustness)
    const toLocalDateString = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayString = toLocalDateString(now);

    // Only update streak logic on the first drill of a new calendar day
    if (progress.lastStreakDay !== todayString) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = toLocalDateString(yesterday);

        if (progress.lastStreakDay === yesterdayString) {
            // Continued streak: last drill was yesterday
            progress.currentDailyStreak += 1;
        } else {
            // New or broken streak
            progress.currentDailyStreak = 1;
        }

        progress.longestDailyStreak = Math.max(progress.longestDailyStreak, progress.currentDailyStreak);
        progress.lastStreakDay = todayString;
    }
    // --- End Streak Logic ---

    // Calculate new attempt details
    const existingAttemptIndex = progress.attempts.findIndex(a => a.drillId === attempt.drillId);
    let previousIntervalDays = 0;
    if (existingAttemptIndex > -1) {
        const existingAttempt = progress.attempts[existingAttemptIndex];
        const lastAttemptDate = new Date(existingAttempt.attemptedAt);
        const nextShowDate = new Date(existingAttempt.nextShowAt);
        previousIntervalDays = (nextShowDate.getTime() - lastAttemptDate.getTime()) / (1000 * 3600 * 24);
    }
    const intervalDays = getSpacedRepetitionInterval(attempt.isCorrect, previousIntervalDays);
    const nextShowAtDate = new Date();
    nextShowAtDate.setDate(nextShowAtDate.getDate() + intervalDays);
    const correctness = attempt.isCorrect ? 1 : 0;
    const calibrationScore = Math.round((1 - Math.abs((attempt.confidence / 100) - correctness)) * 100);
    const newAttempt: DrillAttempt = {
        ...attempt,
        pmLevelAtAttempt: user.pmLevel,
        calibrationScore,
        nextShowAt: nextShowAtDate.toISOString()
    };

    // Update attempts array
    if (existingAttemptIndex > -1) {
        progress.attempts[existingAttemptIndex] = newAttempt;
    } else {
        progress.attempts.push(newAttempt);
    }

    // Update daily completions for free users
    if (user.plan === 'Free') {
        const nowISO = now.toISOString();
        const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        progress.dailyDrillCompletions = progress.dailyDrillCompletions.filter(
            c => new Date(c.completedAt) > twoDaysAgo
        );
        progress.dailyDrillCompletions.push({
            drillId: attempt.drillId,
            completedAt: nowISO
        });
    }

    // Save all progress
    dataService.saveUserProgress(user.id, progress);
};

export const getNextDrill = (user: User, desiredPmLevel?: PmLevel): Drill | null => {
    const allDrills = dataService.getDrillBank();
    if (allDrills.length === 0) return null;

    const progress = dataService.getUserProgress(user.id);
    const status = getDailyDrillStatus(user, progress);

    if (!status.isUnlimited && status.drillsRemaining <= 0) {
        return null;
    }

    const targetPmLevel = desiredPmLevel || user.pmLevel;
    const drillsForLevel = allDrills.filter(d => d.target_pm_level === targetPmLevel);
    
    if (drillsForLevel.length === 0) {
        return null; // No drills available for this specific level
    }

    const now = new Date();
    const attemptedDrillIds = new Set(progress.attempts.map(a => a.drillId));

    // Priority 1: Unseen Drills for the target level
    const unseenDrills = drillsForLevel.filter(d => !attemptedDrillIds.has(d.drill_id));
    if (unseenDrills.length > 0) {
        return unseenDrills[Math.floor(Math.random() * unseenDrills.length)];
    }

    // Priority 2: Due Drills for the target level
    const attemptedDrillIdsForLevel = new Set(drillsForLevel.map(d => d.drill_id));
    const attemptsForLevel = progress.attempts.filter(a => attemptedDrillIdsForLevel.has(a.drillId));
    
    const dueDrills = attemptsForLevel
        .filter(a => new Date(a.nextShowAt) <= now)
        .sort((a, b) => new Date(a.nextShowAt).getTime() - new Date(b.nextShowAt).getTime()); // oldest due first

    if (dueDrills.length > 0) {
        const drill = drillsForLevel.find(d => d.drill_id === dueDrills[0].drillId);
        return drill || null;
    }
    
    // If no drills are due for this level, return null
    return null;
};
