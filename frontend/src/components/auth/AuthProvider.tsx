'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { refreshUser, token, user } = useAuthStore();

  useEffect(() => {
    // Mark as hydrated on client side
    setIsHydrated(true);
  }, []);

  // Memoize the initialization function to prevent infinite loops
  const initializeAuth = useCallback(async () => {
    if (!isHydrated) return; // Don't run until hydrated
    
    try {
      // Check if we have a token and user data
      const storedToken = typeof window !== 'undefined' 
        ? localStorage.getItem('auth_token') || 
          document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_token='))
            ?.split('=')[1]
        : null;

      if (storedToken && !user) {
        // We have a token but no user data, try to refresh
        await refreshUser();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }, [refreshUser, user, isHydrated]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Don't render children until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
