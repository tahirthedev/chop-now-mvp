'use client';

import PublicRoute from '@/components/auth/PublicRoute';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </PublicRoute>
  );
}
