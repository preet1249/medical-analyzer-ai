'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // Verify token is still valid by calling the me endpoint
          try {
            const response = await authAPI.me();
            if (response.success) {
              setUser(JSON.parse(userData));
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('auth-token');
              localStorage.removeItem('user');
            }
          } catch (error) {
            // Token verification failed, clear storage
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { token, user: userData } = response.data;
        
        // Store in localStorage
        localStorage.setItem('auth-token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        
        return true;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    
    // Call backend logout endpoint (optional, doesn't need to wait)
    authAPI.logout().catch(console.error);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,
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