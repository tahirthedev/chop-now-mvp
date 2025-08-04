'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRoles,
  redirectTo = '/auth/login',
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Authenticated but doesn't have required role
      if (requiredRoles && user) {
        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        if (!hasAnyRole(roles)) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router, redirectTo, hasAnyRole]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (requiredRoles && user) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!hasAnyRole(roles)) {
      return <>{fallback}</>;
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}
