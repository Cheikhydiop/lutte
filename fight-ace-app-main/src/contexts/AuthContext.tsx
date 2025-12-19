import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/AuthService';
import { webSocketService } from '@/services/WebSocketService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = authService.getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const { data, error } = await authService.getProfile();
    if (error) {
      authService.setToken(null);
      setUser(null);
    } else {
      // Le backend renvoie { user: User }
      const userData = (data as any)?.user || data;
      setUser(userData ?? null);
      if (userData?.id) {
        webSocketService.connect(userData.id);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await authService.login(email, password);
    if (error) {
      return { success: false, error };
    }
    setUser(data!.user);
    if (data!.user.id) {
      webSocketService.connect(data!.user.id);
    }
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await authService.register(name, email, password);
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  };

  const logout = async () => {
    await authService.logout();
    webSocketService.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
