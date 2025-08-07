
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../services/localAuthService';
import * as dataService from '../services/localDataService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, pmLevel: User['pmLevel']) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string; }>;
  changeUserPassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string; }>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);
  
  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const loggedInUser = await authService.login(email, pass);
    if (loggedInUser) {
      setUser(loggedInUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, pass: string, pmLevel: User['pmLevel']): Promise<boolean> => {
    setLoading(true);
    const newUser = await authService.signup(email, pass, name, pmLevel);
    if (newUser) {
      setUser(newUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<{ success: boolean; message: string; }> => {
      if (!user) return { success: false, message: "No user logged in."};
      
      const updatedUser = dataService.updateUser(user.id, updates);
      if (updatedUser) {
          setUser(updatedUser);
          return { success: true, message: "Profile updated successfully!" };
      }
      return { success: false, message: "Failed to update profile." };
  }

  const changeUserPassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string; }> => {
      if (!user) return { success: false, message: "No user logged in."};
      return await authService.changePassword(user.id, oldPass, newPass);
  }

  const deleteAccount = async (): Promise<void> => {
      if (!user) return;
      
      if (user.plan !== 'Free') {
          console.log(`SIMULATED EMAIL to ${user.email}:
Subject: We're sorry to see you go from ProEvals!

Hi ${user.name},

This is a confirmation that your ProEvals account has been successfully deleted. 
Your subscription has been cancelled, and you will not be billed again.

Thank you for being a part of our community. We hope you found value in our platform. If you ever change your mind, we'd love to have you back!

Best regards,
The ProEvals Team`);
      }

      dataService.deleteUser(user.id);
      logout(); // This handles state update and navigation
  }

  const value = { user, loading, login, signup, logout, updateUserProfile, changeUserPassword, deleteAccount };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
