import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/hooks/api/useAuth';
import { AuthUser, LoginCredentials, RegisterData } from '@/types';

interface AuthContextType {
  user: AuthUser | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthHook();

  const login = async (credentials: LoginCredentials) => {
    return new Promise<void>((resolve, reject) => {
      auth.login.mutate(credentials, {
        onSuccess: (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.message));
          }
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const register = async (data: RegisterData) => {
    return new Promise<void>((resolve, reject) => {
      auth.register.mutate(data, {
        onSuccess: (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.message));
          }
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const logout = async () => {
    return new Promise<void>((resolve, reject) => {
      auth.logout.mutate(undefined, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
