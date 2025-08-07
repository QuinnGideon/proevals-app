
import { Drill, UserProgress, User } from '../types';

const DRILL_BANK_KEY = 'proevals_drill_bank';
const LEADERBOARD_KEY = 'proevals_leaderboard';
const USERS_KEY = 'proevals_users';

// --- User Management ---

export const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

export const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();
    return users.find(u => u.email.toLowerCase() === normalizedEmail);
};

export const findUserById = (id: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.id === id);
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return null;
    }
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    saveUsers(users);
    return updatedUser;
};

export const addUser = (user: User): void => {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
};

export const deleteUser = (userId: string): void => {
    const users = getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    localStorage.removeItem(getUserProgressKey(userId));
    console.log(`User ${userId} and their progress have been deleted.`);
}


// --- Drill Bank ---

export const getDrillBank = (): Drill[] => {
    const bankJson = localStorage.getItem(DRILL_BANK_KEY);
    if (!bankJson) return [];
    try {
        const data = JSON.parse(bankJson);
        // Handle both formats: {drills: []} and []
        return Array.isArray(data) ? data : (data.drills || []);
    } catch (e) {
        console.error("Error parsing drill bank:", e);
        return [];
    }
};

export const saveDrillBank = (drills: Drill[]): void => {
    localStorage.setItem(DRILL_BANK_KEY, JSON.stringify({ drills }));
};

export const addDrillToBank = (drill: Drill): void => {
    const bank = getDrillBank();
    const drillExists = bank.some(d => d.drill_id === drill.drill_id);
    if (!drillExists) {
        bank.push(drill);
        saveDrillBank(bank);
    }
};

export const updateDrill = (drillId: string, updatedDrill: Drill): Drill | null => {
    const bank = getDrillBank();
    const drillIndex = bank.findIndex(d => d.drill_id === drillId);
    if (drillIndex === -1) {
        return null;
    }
    bank[drillIndex] = updatedDrill;
    saveDrillBank(bank);
    return updatedDrill;
};

export const deleteDrill = (drillId: string): void => {
    const bank = getDrillBank();
    const updatedBank = bank.filter(d => d.drill_id !== drillId);
    saveDrillBank(updatedBank);
};

export const replaceDrillBank = (drills: Drill[]): void => {
    saveDrillBank(drills);
}

// --- User Progress ---

const getUserProgressKey = (userId: string) => `proevals_progress_${userId}`;

export const getUserProgress = (userId:string): UserProgress => {
    const progressJson = localStorage.getItem(getUserProgressKey(userId));
    if (progressJson) {
        const progress = JSON.parse(progressJson);
        // Backwards compatibility for users without new fields
        return {
            ...progress,
            savedDrills: progress.savedDrills ?? [],
            currentStreak: progress.currentStreak ?? 0,
            longestStreak: progress.longestStreak ?? 0,
            dailyDrillCompletions: progress.dailyDrillCompletions ?? [],
            currentDailyStreak: progress.currentDailyStreak ?? 0,
            longestDailyStreak: progress.longestDailyStreak ?? 0,
            lastStreakDay: progress.lastStreakDay ?? null,
            lastSeenStats: progress.lastSeenStats ?? null,
        };
    }
    return {
        userId,
        attempts: [],
        savedDrills: [],
        currentStreak: 0,
        longestStreak: 0,
        currentDailyStreak: 0,
        longestDailyStreak: 0,
        lastStreakDay: null,
        dailyDrillCompletions: []
    };
};

export const saveUserProgress = (userId: string, progress: UserProgress): void => {
    localStorage.setItem(getUserProgressKey(userId), JSON.stringify(progress));
};

export const toggleSaveDrill = (userId: string, drillId: string): boolean => {
    const progress = getUserProgress(userId);
    const savedDrills = progress.savedDrills || [];
    const isCurrentlySaved = savedDrills.includes(drillId);

    if (isCurrentlySaved) {
        progress.savedDrills = savedDrills.filter(id => id !== drillId);
    } else {
        progress.savedDrills = [...savedDrills, drillId];
    }
    
    saveUserProgress(userId, progress);
    return !isCurrentlySaved;
};

// --- Leaderboard ---

export const getLeaderboard = (): any[] => {
    const leaderboardJson = localStorage.getItem(LEADERBOARD_KEY);
    return leaderboardJson ? JSON.parse(leaderboardJson) : [];
};

export const saveLeaderboard = (data: any[]): void => {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
};

export const isLeaderboardSeeded = (): boolean => {
    return localStorage.getItem('proevals_leaderboard_seeded') === 'true';
}

export const markLeaderboardAsSeeded = (): void => {
    localStorage.setItem('proevals_leaderboard_seeded', 'true');
}

export const resetLeaderboardSeedStatus = (): void => {
    localStorage.removeItem('proevals_leaderboard_seeded');
}