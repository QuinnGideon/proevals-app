
import { User, DrillAttempt, Drill, SkillCategory } from '../types';
import * as dataService from './localDataService';

export interface LeaderboardEntry {
    userId: string;
    name: string;
    rank: number;
    avgCalibrationScore: number;
    drillsCompleted: number;
}

const MIN_DRILLS_FOR_RANKING = 5;
const MIN_DRILLS_FOR_SKILL_RANKING = 10;

const getAttemptsInPeriod = (attempts: DrillAttempt[], period: 'weekly' | 'monthly'): DrillAttempt[] => {
    const now = new Date();
    const days = period === 'weekly' ? 7 : 30;
    const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return attempts.filter(a => new Date(a.attemptedAt) >= periodStart);
};

export const getLeaderboardData = (period: 'weekly' | 'monthly'): LeaderboardEntry[] => {
    const users = dataService.getUsers();
    
    const rankedUsers = users.map(user => {
        const progress = dataService.getUserProgress(user.id);
        const periodAttempts = getAttemptsInPeriod(progress.attempts, period);

        if (periodAttempts.length < MIN_DRILLS_FOR_RANKING) {
            return null; // Not eligible
        }

        const validAttempts = periodAttempts.filter(
            attempt => typeof attempt.calibrationScore === 'number' && !isNaN(attempt.calibrationScore)
        );

        if (validAttempts.length === 0) {
            return null;
        }

        const totalScore = validAttempts.reduce((sum, attempt) => sum + attempt.calibrationScore, 0);
        const avgCalibrationScore = Math.round(totalScore / validAttempts.length);
        
        return {
            userId: user.id,
            name: user.name,
            avgCalibrationScore,
            drillsCompleted: periodAttempts.length,
        };
    }).filter(u => u !== null) as Omit<LeaderboardEntry, 'rank'>[];

    // Sort users
    rankedUsers.sort((a, b) => {
        // 1. Sort by avgCalibrationScore descending
        if (a.avgCalibrationScore !== b.avgCalibrationScore) {
            return b.avgCalibrationScore - a.avgCalibrationScore;
        }
        // 2. Tie-breaker: drillsCompleted descending
        return b.drillsCompleted - a.drillsCompleted;
    });

    // Assign rank
    return rankedUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
    }));
};

export interface UserLeaderboardStatus {
    isRanked: boolean;
    drillsCompleted: number;
    drillsNeeded: number;
    rank?: number;
}

export const getUserLeaderboardStatus = (userId: string, period: 'weekly' | 'monthly'): UserLeaderboardStatus => {
    const progress = dataService.getUserProgress(userId);
    const periodAttempts = getAttemptsInPeriod(progress.attempts, period);
    const drillsCompleted = periodAttempts.length;

    if (drillsCompleted >= MIN_DRILLS_FOR_RANKING) {
        const leaderboard = getLeaderboardData(period);
        const userRankData = leaderboard.find(u => u.userId === userId);
        return {
            isRanked: true,
            drillsCompleted,
            drillsNeeded: 0,
            rank: userRankData?.rank
        };
    } else {
        return {
            isRanked: false,
            drillsCompleted,
            drillsNeeded: MIN_DRILLS_FOR_RANKING - drillsCompleted,
        };
    }
};

export const getSkillLeaderboardData = (skillCategory: SkillCategory): LeaderboardEntry[] => {
    const users = dataService.getUsers();
    const drills = dataService.getDrillBank();
    
    const drillsInSkillCategory = new Set(
        drills.filter(d => d.skill_category === skillCategory).map(d => d.drill_id)
    );

    const rankedUsers = users.map(user => {
        const progress = dataService.getUserProgress(user.id);
        const skillAttempts = progress.attempts.filter(a => drillsInSkillCategory.has(a.drillId));

        if (skillAttempts.length < MIN_DRILLS_FOR_SKILL_RANKING) {
            return null; // Not eligible
        }

        const validAttempts = skillAttempts.filter(
            attempt => typeof attempt.calibrationScore === 'number' && !isNaN(attempt.calibrationScore)
        );

        if (validAttempts.length === 0) {
            return null;
        }

        const totalScore = validAttempts.reduce((sum, attempt) => sum + attempt.calibrationScore, 0);
        const avgCalibrationScore = Math.round(totalScore / validAttempts.length);
        
        return {
            userId: user.id,
            name: user.name,
            avgCalibrationScore,
            drillsCompleted: skillAttempts.length,
        };
    }).filter(u => u !== null) as Omit<LeaderboardEntry, 'rank'>[];

    rankedUsers.sort((a, b) => {
        if (a.avgCalibrationScore !== b.avgCalibrationScore) {
            return b.avgCalibrationScore - a.avgCalibrationScore;
        }
        return b.drillsCompleted - a.drillsCompleted;
    });

    return rankedUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
    }));
};

export const getUserSkillLeaderboardStatus = (userId: string, skillCategory: SkillCategory): UserLeaderboardStatus => {
    const progress = dataService.getUserProgress(userId);
    const drills = dataService.getDrillBank();
    const drillsInSkillCategory = new Set(
        drills.filter(d => d.skill_category === skillCategory).map(d => d.drill_id)
    );

    const skillAttempts = progress.attempts.filter(a => drillsInSkillCategory.has(a.drillId));
    const drillsCompleted = skillAttempts.length;

    if (drillsCompleted >= MIN_DRILLS_FOR_SKILL_RANKING) {
        const leaderboard = getSkillLeaderboardData(skillCategory);
        const userRankData = leaderboard.find(u => u.userId === userId);
        return {
            isRanked: true,
            drillsCompleted,
            drillsNeeded: 0,
            rank: userRankData?.rank
        };
    } else {
        return {
            isRanked: false,
            drillsCompleted,
            drillsNeeded: MIN_DRILLS_FOR_SKILL_RANKING - drillsCompleted,
        };
    }
};
