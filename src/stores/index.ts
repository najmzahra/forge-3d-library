// Export all stores
export { useAuthStore } from './authStore';
export { useCartStore } from './cartStore';
export { useUploadStore } from './uploadStore';
export { useAppStore } from './appStore';

// Store utilities and selectors
export const authSelectors = {
  user: (state: any) => state.user,
  isAuthenticated: (state: any) => state.isAuthenticated,
  isAdmin: (state: any) => state.user?.role === 'admin',
  isDesigner: (state: any) => state.user?.role === 'designer',
  isEngineer: (state: any) => state.user?.role === 'engineer',
  token: (state: any) => state.token,
};

export const cartSelectors = {
  items: (state: any) => state.items,
  total: (state: any) => state.total,
  itemCount: (state: any) => state.itemCount,
  isEmpty: (state: any) => state.items.length === 0,
};

export const uploadSelectors = {
  files: (state: any) => state.files,
  projects: (state: any) => state.projects,
  currentUpload: (state: any) => state.currentUpload,
  hasActiveUploads: (state: any) => state.hasActiveUploads(),
  uploadProgress: (state: any) => state.getUploadProgress(),
};

export const appSelectors = {
  notifications: (state: any) => state.notifications,
  unreadCount: (state: any) => state.unreadCount,
  preferences: (state: any) => state.preferences,
  theme: (state: any) => state.preferences.theme,
  sidebarOpen: (state: any) => state.sidebarOpen,
  cartOpen: (state: any) => state.cartOpen,
};
