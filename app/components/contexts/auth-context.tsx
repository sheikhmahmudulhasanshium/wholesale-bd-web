"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient  from '@/lib/apiClient';
import { toast } from 'sonner';
import { User } from '@/lib/types';
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkLoggedInUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const checkLoggedInUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.auth.getProfile();
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
        localStorage.removeItem('access_token');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('access_token');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    checkLoggedInUser();
  }, [checkLoggedInUser]);
  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    setUser(userData);
    router.push('/products');
  };
  const logout = () => {
    toast.success("You have been logged out.");
    setUser(null);
    localStorage.removeItem('access_token');
    router.push('/login');
  };
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkLoggedInUser,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}