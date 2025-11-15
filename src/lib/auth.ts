// Authentication Service

import { apiClient, ApiResponse } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>('/api/auth/register', data);
  },

  /**
   * Login user and get JWT token
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/api/auth/login', data);
  },

  /**
   * Store auth token in localStorage
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  /**
   * Remove auth token from localStorage
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * Store user data in localStorage
   */
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  /**
   * Get user data from localStorage
   */
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Remove user data from localStorage
   */
  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Logout user (clear token and user data)
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
  },
};
