import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Notification, UserPreferences } from '@/types';

interface AppStore {
  // UI State
  sidebarOpen: boolean;
  searchOpen: boolean;
  cartOpen: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // User Preferences
  preferences: UserPreferences;

  // UI Actions
  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  toggleCart: () => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Preferences Actions
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Computed
  getUnreadNotifications: () => Notification[];
  getRecentNotifications: (limit?: number) => Notification[];
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  privacy: {
    showEmail: false,
    showProjects: true,
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial UI State
      sidebarOpen: false,
      searchOpen: false,
      cartOpen: false,

      // Initial Notifications
      notifications: [],
      unreadCount: 0,

      // Initial Preferences
      preferences: defaultPreferences,

      // UI Actions
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      setSearchOpen: (open: boolean) => set({ searchOpen: open }),
      setCartOpen: (open: boolean) => set({ cartOpen: open }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

      // Notification Actions
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id: string) => {
        const notification = get().notifications.find(n => n.id === id);
        set((state) => ({
          notifications: state.notifications.filter(notif => notif.id !== id),
          unreadCount: notification && !notification.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        }));
      },

      clearNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      // Preferences Actions
      updatePreferences: (updates: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },

      // Computed getters
      getUnreadNotifications: () =>
        get().notifications.filter(notif => !notif.read),

      getRecentNotifications: (limit = 10) =>
        get().notifications
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit),
    }),
    {
      name: 'forge3d-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        preferences: state.preferences,
        // Don't persist UI state (sidebar, search, cart open)
      }),
    }
  )
);
