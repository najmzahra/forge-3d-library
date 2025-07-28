import { useAppStore } from '@/stores/appStore';
import { UserPreferences } from '@/types';

/**
 * Enhanced app state hook with notifications and preferences
 */
export const useApp = () => {
  const {
    sidebarOpen,
    searchOpen,
    cartOpen,
    notifications,
    unreadCount,
    preferences,
    setSidebarOpen,
    setSearchOpen,
    setCartOpen,
    toggleSidebar,
    toggleSearch,
    toggleCart,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    updatePreferences,
    resetPreferences,
    getUnreadNotifications,
    getRecentNotifications,
  } = useAppStore();

  const notify = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string = ''
  ) => {
    addNotification({
      type,
      title,
      message,
    });
  };

  const notifySuccess = (title: string, message?: string) => 
    notify('success', title, message || '');

  const notifyError = (title: string, message?: string) => 
    notify('error', title, message || '');

  const notifyWarning = (title: string, message?: string) => 
    notify('warning', title, message || '');

  const notifyInfo = (title: string, message?: string) => 
    notify('info', title, message || '');

  const toggleTheme = () => {
    const currentTheme = preferences.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updatePreferences({ theme: newTheme });
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    updatePreferences({ [key]: value });
  };

  const hasUnreadNotifications = () => unreadCount > 0;

  const clearOldNotifications = () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7); // 7 days old
    
    notifications.forEach(n => {
      if (new Date(n.timestamp) < cutoff) {
        removeNotification(n.id);
      }
    });
  };

  return {
    // UI State
    sidebarOpen,
    searchOpen,
    cartOpen,
    
    // Notification State
    notifications,
    unreadCount,
    preferences,
    
    // UI Actions
    setSidebarOpen,
    setSearchOpen,
    setCartOpen,
    toggleSidebar,
    toggleSearch,
    toggleCart,
    
    // Theme Actions
    toggleTheme,
    
    // Notification Actions
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    clearOldNotifications,
    
    // Preferences Actions
    updatePreferences,
    updatePreference,
    resetPreferences,
    
    // Computed
    unreadNotifications: getUnreadNotifications(),
    recentNotifications: getRecentNotifications(),
    hasUnreadNotifications: hasUnreadNotifications(),
    isDarkMode: preferences.theme === 'dark',
    isLightMode: preferences.theme === 'light',
    isSystemTheme: preferences.theme === 'system',
  };
};
