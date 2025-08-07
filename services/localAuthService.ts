

import { User, PmLevel } from '../types';
import * as dataService from './localDataService';

const CURRENT_USER_SESSION_KEY = 'proevals_current_user';

// NOTE: In a real app, never handle passwords this way.
// This is a simplified, insecure simulation for a local-first demo.
export const simpleHash = (s: string): string => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

export const signup = async (email: string, password: string, name: string, pmLevel: PmLevel): Promise<User | null> => {
    const normalizedEmail = email.toLowerCase().trim();
    if (dataService.findUserByEmail(normalizedEmail)) {
        return null; // User already exists, handled gracefully in UI.
    }

    const newUser: User = {
        id: `user_${Date.now()}`,
        email: normalizedEmail,
        passwordHash: simpleHash(password.trim()),
        name: name.trim(),
        pmLevel,
        plan: 'Free',
        createdAt: new Date().toISOString()
    };
    
    dataService.addUser(newUser);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, newUser.id);
    return newUser;
};

export const login = async (email: string, password: string): Promise<User | null> => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = dataService.findUserByEmail(normalizedEmail);
    if (user && user.passwordHash === simpleHash(password.trim())) {
        localStorage.setItem(CURRENT_USER_SESSION_KEY, user.id);
        return user;
    }
    console.error("Invalid login credentials");
    return null; // Invalid credentials
};

export const logout = (): void => {
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    const userId = localStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (!userId) return null;

    const users = dataService.getUsers();
    return users.find(u => u.id === userId) || null;
};

export const changePassword = async (userId: string, oldPass: string, newPass: string): Promise<{ success: boolean; message:string }> => {
    const user = dataService.findUserById(userId);
    if (!user) {
        return { success: false, message: 'User not found.' };
    }
    if (user.passwordHash !== simpleHash(oldPass.trim())) {
        return { success: false, message: 'Current password is not correct.' };
    }
    
    dataService.updateUser(userId, { passwordHash: simpleHash(newPass.trim()) });
    return { success: true, message: 'Password changed successfully.' };
}