import { useAuthStore } from '@/stores/authStore';
import { AuthService } from '@/services/authService';
import { LoginCredentials, RegisterData } from '@/types';
import { toast } from 'sonner';

/**
 * Enhanced auth hook that integrates Zustand store with API services
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    setAuth,
    clearAuth,
    setLoading,
    updateUser,
    isAdmin,
    isDesigner,
    isEngineer,
  } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await AuthService.login(credentials);
      if (response.success) {
        setAuth(response.data.user, response.data.token);
        toast.success(response.message);
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error('Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await AuthService.register(data);
      if (response.success) {
        setAuth(response.data.user, response.data.token);
        toast.success(response.message);
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await AuthService.logout();
      clearAuth();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      // Still clear auth even if API call fails
      clearAuth();
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const initializeAuth = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getCurrentUser();
      if (response.success && response.data) {
        const token = AuthService.getToken();
        if (token) {
          setAuth(response.data, token);
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Role checks
    isAdmin: isAdmin(),
    isDesigner: isDesigner(),
    isEngineer: isEngineer(),
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    initializeAuth,
  };
};
