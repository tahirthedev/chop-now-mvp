'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon, ShoppingBagIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're authenticated and have user data
    if (!isLoading && isAuthenticated && user?.role) {
      // Use replace instead of push to prevent back button issues
      switch (user.role) {
        case 'ADMIN':
          router.replace('/admin/dashboard');
          break;
        case 'RESTAURANT_OWNER':
          router.replace('/restaurant/dashboard');
          break;
        case 'RIDER':
          router.replace('/rider/dashboard');
          break;
        case 'CUSTOMER':
        default:
          // Customers stay on the homepage - no redirect needed
          break;
      }
    }
  }, [isLoading, isAuthenticated, user?.role, router]); // More specific dependencies

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loading while redirecting authenticated users (except customers)
  if (isAuthenticated && user?.role && user.role !== 'CUSTOMER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">ChopNow</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-500 transition-colors">
                How It Works
              </Link>
              {isAuthenticated && user?.role === 'CUSTOMER' ? (
                <>
                  <span className="text-gray-600">Welcome, {user.name || user.email}</span>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-12 pb-20 sm:pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl">
                Delicious Food, 
                <span className="text-blue-500"> Delivered Fast</span>
              </h1>
              <p className="max-w-md mx-auto mt-5 text-xl text-gray-500 sm:max-w-3xl">
                Order from your favorite restaurants and get your food delivered in minutes.
                Fresh, fast, and always delicious.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                {isAuthenticated && user?.role === 'CUSTOMER' ? (
                  <>
                    <Link
                      href="#features"
                      className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Browse Restaurants
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Learn More
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/register"
                      className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Order Now
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="/auth/login"
                      className="flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Why Choose ChopNow?
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                We make food delivery simple, fast, and reliable.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Fast Delivery</h3>
                <p className="mt-2 text-gray-500">
                  Get your food delivered in 30 minutes or less from local restaurants.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <ShoppingBagIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Wide Selection</h3>
                <p className="mt-2 text-gray-500">
                  Choose from hundreds of restaurants and thousands of menu items.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <TruckIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Real-time Tracking</h3>
                <p className="mt-2 text-gray-500">
                  Track your order from the restaurant to your doorstep in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Ordering food has never been easier.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 mx-auto text-xl font-bold">
                  1
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Browse & Select</h3>
                <p className="mt-2 text-gray-500">
                  Browse restaurants near you and select your favorite dishes.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 mx-auto text-xl font-bold">
                  2
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Place Order</h3>
                <p className="mt-2 text-gray-500">
                  Add items to cart, customize your order, and checkout securely.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 mx-auto text-xl font-bold">
                  3
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Enjoy!</h3>
                <p className="mt-2 text-gray-500">
                  Track your order and enjoy your delicious meal when it arrives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {isAuthenticated && user?.role === 'CUSTOMER' ? (
              <>
                <h2 className="text-3xl font-extrabold text-white">
                  Ready to order?
                </h2>
                <p className="mt-4 text-xl text-blue-100">
                  Browse our amazing selection of restaurants and start ordering your favorite meals.
                </p>
                <div className="mt-8">
                  <Link
                    href="#features"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Browse Restaurants
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-white">
                  Ready to get started?
                </h2>
                <p className="mt-4 text-xl text-blue-100">
                  Join thousands of satisfied customers who trust ChopNow for their food delivery needs.
                </p>
                <div className="mt-8">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Start Ordering Today
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ShoppingBagIcon className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">ChopNow</span>
            </div>
            <p className="text-gray-400">
              Making food delivery simple, fast, and delicious.
            </p>
            <div className="mt-8 flex justify-center space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm">
                © 2024 ChopNow. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
