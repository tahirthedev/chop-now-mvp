'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  ClockIcon, 
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  GlobeAltIcon,
  CreditCardIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [featuredRestaurants] = useState([
    {
      id: 1,
      name: "Mama Afrika's Kitchen",
      cuisine: "Nigerian",
      rating: 4.8,
      deliveryTime: "25-35 min",
      image: "/api/placeholder/300/200",
      speciality: "Jollof Rice & Plantain",
      badge: "Popular"
    },
    {
      id: 2,
      name: "Addis Red Sea",
      cuisine: "Ethiopian",
      rating: 4.6,
      deliveryTime: "30-40 min",
      image: "/api/placeholder/300/200",
      speciality: "Injera & Doro Wat",
      badge: "New"
    },
    {
      id: 3,
      name: "Sahara Spice",
      cuisine: "Moroccan",
      rating: 4.7,
      deliveryTime: "20-30 min",
      image: "/api/placeholder/300/200",
      speciality: "Tagine & Couscous",
      badge: "Trending"
    }
  ]);

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
  }, [isLoading, isAuthenticated, user?.role, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <header className="border-b border-orange-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">ChopNow</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="#restaurants" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">
                Restaurants
              </Link>
              <Link href="#how-it-works" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">
                How It Works
              </Link>
              {isAuthenticated && user?.role === 'CUSTOMER' ? (
                <>
                  <span className="text-orange-700 font-medium">Welcome, {user.name || user.email}</span>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline" 
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
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
              <h1 className="text-4xl font-extrabold text-orange-900 sm:text-6xl">
                Authentic African Cuisine, 
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"> Delivered to You</span>
              </h1>
              <p className="max-w-md mx-auto mt-5 text-xl text-orange-700 sm:max-w-3xl">
                Taste the flavors of Africa with our curated selection of authentic restaurants. 
                From Nigerian Jollof to Ethiopian Injera, experience Africa in every bite.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                {isAuthenticated && user?.role === 'CUSTOMER' ? (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                    >
                      <Link href="#restaurants">
                        Browse Restaurants
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3"
                    >
                      <Link href="#how-it-works">Learn More</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                    >
                      <Link href="/auth/register">
                        Order Now
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3"
                    >
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Restaurants Section */}
        <section id="restaurants" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-orange-900">
                Featured African Restaurants
              </h2>
              <p className="mt-4 text-lg text-orange-700">
                Discover authentic flavors from across the African continent
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-orange-100">
                    <div className="flex items-center justify-center h-48 bg-gradient-to-br from-orange-200 to-amber-200">
                      <span className="text-orange-600 font-medium">Restaurant Image</span>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-orange-900">{restaurant.name}</CardTitle>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {restaurant.badge}
                      </Badge>
                    </div>
                    <CardDescription className="text-orange-600">
                      {restaurant.cuisine} Cuisine
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-orange-700 mb-2">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-orange-600 mr-1" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                    <p className="text-orange-600 font-medium mb-4">
                      Speciality: {restaurant.speciality}
                    </p>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      View Menu
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-orange-900">
                Why Choose ChopNow?
              </h2>
              <p className="mt-4 text-lg text-orange-700">
                Bringing Africa's finest cuisine to your doorstep
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center border-orange-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white mx-auto mb-4">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-orange-900 mb-2">Fast Delivery</h3>
                  <p className="text-orange-700">
                    Fresh African cuisine delivered in 30 minutes or less
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-orange-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-600 text-white mx-auto mb-4">
                    <GlobeAltIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-orange-900 mb-2">Authentic Flavors</h3>
                  <p className="text-orange-700">
                    Genuine recipes from Nigerian, Ethiopian, Ghanaian and more
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-orange-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white mx-auto mb-4">
                    <TruckIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-orange-900 mb-2">Real-time Tracking</h3>
                  <p className="text-orange-700">
                    Track your order from kitchen to your doorstep
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-orange-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-600 text-white mx-auto mb-4">
                    <CreditCardIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-orange-900 mb-2">Secure Payment</h3>
                  <p className="text-orange-700">
                    Multiple payment options with bank-level security
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-orange-900">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-orange-700">
                From your favorite African restaurant to your table in three simple steps
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="text-center border-orange-200">
                <CardContent className="pt-8">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white mx-auto text-xl font-bold mb-6">
                    1
                  </div>
                  <h3 className="text-lg font-medium text-orange-900 mb-4">Browse & Discover</h3>
                  <p className="text-orange-700">
                    Explore authentic African restaurants near you and discover traditional dishes from across the continent.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-orange-200">
                <CardContent className="pt-8">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white mx-auto text-xl font-bold mb-6">
                    2
                  </div>
                  <h3 className="text-lg font-medium text-orange-900 mb-4">Order & Customize</h3>
                  <p className="text-orange-700">
                    Add your favorite dishes to cart, customize spice levels, and checkout securely with multiple payment options.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-orange-200">
                <CardContent className="pt-8">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white mx-auto text-xl font-bold mb-6">
                    3
                  </div>
                  <h3 className="text-lg font-medium text-orange-900 mb-4">Track & Enjoy</h3>
                  <p className="text-orange-700">
                    Track your order in real-time and enjoy authentic African flavors delivered fresh to your doorstep.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {isAuthenticated && user?.role === 'CUSTOMER' ? (
              <>
                <h2 className="text-3xl font-extrabold text-white">
                  Craving Authentic African Food?
                </h2>
                <p className="mt-4 text-xl text-orange-100">
                  Explore our curated selection of the finest African restaurants and start your culinary journey today.
                </p>
                <div className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3"
                  >
                    <Link href="#restaurants">
                      Browse Restaurants
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-white">
                  Ready to Taste Africa?
                </h2>
                <p className="mt-4 text-xl text-orange-100">
                  Join thousands who trust ChopNow for authentic African cuisine delivered fresh to their door.
                </p>
                <div className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3"
                  >
                    <Link href="/auth/register">
                      Start Ordering Today
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-orange-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ShoppingBagIcon className="h-8 w-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">ChopNow</span>
            </div>
            <p className="text-orange-300 mb-6">
              Bringing the authentic taste of Africa to your doorstep across the UK.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Popular Cuisines</h4>
                <ul className="space-y-2 text-orange-300">
                  <li>Nigerian</li>
                  <li>Ethiopian</li>
                  <li>Ghanaian</li>
                  <li>Moroccan</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-orange-300">
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-orange-300">
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-orange-800 pt-8">
              <p className="text-orange-400 text-sm">
                © 2025 ChopNow. Proudly serving African cuisine across the UK.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
