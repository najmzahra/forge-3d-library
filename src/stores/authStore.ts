import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, AuthState } from '@/types';

interface AuthStore extends AuthState {
  // Actions
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  
  // Computed
  isAdmin: () => boolean;
  isDesigner: () => boolean;
  isEngineer: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (user: AuthUser, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      updateUser: (updates: Partial<AuthUser>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Computed getters
      isAdmin: () => get().user?.role === 'admin',
      isDesigner: () => get().user?.role === 'designer',
      isEngineer: () => get().user?.role === 'engineer',
    }),
    {
      name: 'forge3d-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
