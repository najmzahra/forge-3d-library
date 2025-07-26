import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/authService';
import { LoginCredentials, RegisterData, AuthUser } from '@/types';
import { toast } from 'sonner';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData(['currentUser'], response.data.user);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('An error occurred during login');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => AuthService.register(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData(['currentUser'], response.data.user);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('An error occurred during registration');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: (response) => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear(); // Clear all cached data
      if (response.success) {
        toast.success(response.message);
      }
    },
    onError: () => {
      toast.error('An error occurred during logout');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await AuthService.getCurrentUser();
      return response.success ? response.data : null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

export const useAuth = () => {
  const { data: user, isLoading } = useCurrentUser();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
};
