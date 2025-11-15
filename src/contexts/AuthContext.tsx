'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = authService.getUser();
    const token = authService.getToken();

    if (storedUser && token) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);

      if (response.success && response.data) {
        const { user, token } = response.data;
        authService.setToken(token);
        authService.setUser(user);
        setUser(user);
        return { success: true, message: 'Login successful' };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      if (response.success && response.data) {
        // After registration, automatically log in
        const loginResponse = await authService.login({
          email: data.email,
          password: data.password,
        });

        if (loginResponse.success && loginResponse.data) {
          const { user, token } = loginResponse.data;
          authService.setToken(token);
          authService.setUser(user);
          setUser(user);
        }

        return { success: true, message: 'Registration successful' };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
