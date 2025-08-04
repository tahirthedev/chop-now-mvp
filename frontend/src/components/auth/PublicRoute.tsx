'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PublicRoute({
  children,
  redirectTo = '/dashboard'
}: PublicRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // User is already authenticated, redirect to appropriate dashboard
      let redirectPath = redirectTo;
      
      switch (user.role) {
        case 'ADMIN':
          redirectPath = '/admin/dashboard';
          break;
        case 'RESTAURANT_OWNER':
          redirectPath = '/restaurant/dashboard';
          break;
        case 'RIDER':
          redirectPath = '/rider/dashboard';
          break;
        case 'CUSTOMER':
        default:
          redirectPath = '/customer/dashboard';
          break;
      }
      
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // User is not authenticated, show the public content
  return <>{children}</>;
}
