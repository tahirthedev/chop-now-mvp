'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'RESTAURANT_OWNER':
        return '/restaurant/dashboard';
      case 'RIDER':
        return '/rider/dashboard';
      case 'CUSTOMER':
      default:
        return '/customer/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-1 text-xs text-gray-500">
              Signed in as: {user.name} ({user.role})
            </p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <Link
            href={getDashboardLink()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to {user ? 'Dashboard' : 'Login'}
          </Link>
          
          {user && (
            <button
              onClick={logout}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
