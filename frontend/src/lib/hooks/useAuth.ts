import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth-store';
import { AuthAPI } from '@/lib/auth-api';
import { LoginFormData, RegisterFormData, ChangePasswordFormData } from '@/lib/validations';

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
    updateUser,
    refreshUser
  } = useAuthStore();

  // Login function
  const login = useCallback(async (data: LoginFormData) => {
    try {
      setLoading(true);
      clearError();

      const response = await AuthAPI.login(data);

      if (response.success && response.data) {
        storeLogin(response.data.user, response.data.token);
        toast.success('Login successful!');
        return { success: true, user: response.data.user };
      } else {
        const errorMessage = response.message || 'Login failed';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError, clearError]);

  // Register function
  const register = useCallback(async (data: RegisterFormData) => {
    try {
      setLoading(true);
      clearError();

      const response = await AuthAPI.register(data);

      if (response.success && response.data) {
        storeLogin(response.data.user, response.data.token);
        toast.success('Registration successful! Welcome to ChopNow!');
        return { success: true, user: response.data.user };
      } else {
        const errorMessage = response.message || 'Registration failed';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError, clearError]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Call logout API (optional, since we're using JWT)
      await AuthAPI.logout();
      
      // Clear local state
      storeLogout();
      
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error: any) {
      // Even if API call fails, clear local state
      storeLogout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [storeLogout, setLoading, router]);

  // Change password function
  const changePassword = useCallback(async (data: ChangePasswordFormData) => {
    try {
      setLoading(true);
      clearError();

      const response = await AuthAPI.changePassword(data);

      if (response.success) {
        toast.success('Password changed successfully!');
        return { success: true };
      } else {
        const errorMessage = response.message || 'Failed to change password';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearError]);

  // Refresh user data
  const refresh = useCallback(async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [refreshUser]);

  // Check if user has specific role
  const hasRole = useCallback((role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  // Check if user has any of the required roles
  const hasAnyRole = useCallback((roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    changePassword,
    refresh,
    clearError,
    updateUser,

    // Utilities
    hasRole,
    hasAnyRole
  };
};

// Hook for protecting routes
export const useRequireAuth = (redirectTo: string = '/auth/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo);
  }

  return { isAuthenticated, isLoading };
};

// Hook for role-based access control
export const useRequireRole = (
  requiredRoles: string | string[],
  redirectTo: string = '/unauthorized'
) => {
  const { user, isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const router = useRouter();

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const hasPermission = hasAnyRole(roles);

  if (!isLoading && isAuthenticated && !hasPermission) {
    router.push(redirectTo);
  }

  return { hasPermission, isLoading, user };
};
