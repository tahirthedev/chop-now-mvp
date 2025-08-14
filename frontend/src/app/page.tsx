"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPinIcon,
  StarIcon,
  ClockIcon,
  TruckIcon,
  ArrowRightIcon,
  SparklesIcon,
  GiftIcon,
  ShieldCheckIcon,
  HeartIcon,
  UserCircleIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  ShoppingCartIcon,
  PhoneIcon,
  EnvelopeIcon,
  BellIcon,
  PlayIcon,
  UserGroupIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  FireIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";

// Import homepage components
import RestaurantFilters from "@/components/homepage/RestaurantFilters";
import RestaurantGrid from "@/components/homepage/RestaurantGrid";
import OrderTracker from "@/components/homepage/OrderTracker";
import UserProfile from "@/components/homepage/UserProfile";
import LocationPickerModal from "@/components/homepage/LocationPickerModal";

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [currentLocation, setCurrentLocation] = useState<string>("London, UK");
  const [restaurantFilters, setRestaurantFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Live updates data
  const [liveUpdates, setLiveUpdates] = useState({
    activeOrders: 1247,
    trendingDishes: ["Jollof Rice", "Suya Platter", "Injera with Doro Wot"],
    activePromotions: 8,
    deliveryTime: "23 min avg"
  });

  // Enhanced mock data
  const featuredCategories = [
    {
      name: "Nigerian",
      icon: "🇳🇬",
      count: 45,
      trending: true,
      image: "http://localhost:5000/api/food/nigerian?width=80&height=80",
    },
    {
      name: "Ethiopian",
      icon: "🇪🇹", 
      count: 23,
      trending: false,
      image: "http://localhost:5000/api/food/ethiopian?width=80&height=80",
    },
    {
      name: "Moroccan",
      icon: "🇲🇦",
      count: 18,
      trending: false,
      image: "http://localhost:5000/api/food/moroccan?width=80&height=80",
    },
    {
      name: "Ghanaian",
      icon: "🇬🇭",
      count: 32,
      trending: true,
      image: "http://localhost:5000/api/food/ghanaian?width=80&height=80",
    },
    {
      name: "South African",
      icon: "🇿🇦",
      count: 15,
      trending: false,
      image: "http://localhost:5000/api/food/south-african?width=80&height=80",
    },
    {
      name: "Kenyan",
      icon: "🇰🇪",
      count: 12,
      trending: false,
      image: "http://localhost:5000/api/food/kenyan?width=80&height=80",
    },
    {
      name: "Vegan",
      icon: "🥬",
      count: 28,
      trending: true,
      image: "http://localhost:5000/api/food/vegan?width=80&height=80",
    },
    {
      name: "Halal",
      icon: "🕌",
      count: 67,
      trending: false,
      image: "http://localhost:5000/api/food/halal?width=80&height=80",
    },
  ];

  const specialOffers = [
    {
      id: 1,
      title: "20% Off First Order",
      description: "Get 20% off your first order with any African restaurant",
      code: "WELCOME20",
      validUntil: "2025-09-15",
      discount: 20,
      type: "percentage",
      image: "http://localhost:5000/api/placeholder/300/150?text=20%25%20OFF&bg=ff8c00&color=ffffff",
    },
    {
      id: 2,
      title: "Free Delivery Weekend",
      description: "Free delivery on orders over £15 this weekend",
      code: "FREEDEL",
      validUntil: "2025-08-17",
      discount: 0,
      type: "free_delivery",
      image: "http://localhost:5000/api/placeholder/300/150?text=FREE%20DELIVERY&bg=22c55e&color=ffffff",
    },
    {
      id: 3,
      title: "Student Special",
      description: "15% off for students with valid ID",
      code: "STUDENT15",
      validUntil: "2025-12-31",
      discount: 15,
      type: "percentage",
      image: "http://localhost:5000/api/placeholder/300/150?text=STUDENT%20DEAL&bg=6366f1&color=ffffff",
    },
  ];

  const topRestaurants = [
    {
      id: 1,
      name: "Mama Afrika's Kitchen",
      rating: 4.8,
      reviewCount: 324,
      deliveryTime: "25-35 min",
      deliveryFee: 2.99,
      image: "http://localhost:5000/api/food/nigerian?width=300&height=200",
      badge: "Most Popular",
      cuisine: "Nigerian",
      specialties: ["Jollof Rice", "Suya", "Plantain"],
    },
    {
      id: 2,
      name: "Addis Red Sea",
      rating: 4.6,
      reviewCount: 198,
      deliveryTime: "30-40 min",
      deliveryFee: 3.49,
      image: "http://localhost:5000/api/food/ethiopian?width=300&height=200",
      badge: "Trending",
      cuisine: "Ethiopian",
      specialties: ["Injera", "Doro Wot", "Kitfo"],
    },
    {
      id: 3,
      name: "Sahara Spice",
      rating: 4.7,
      reviewCount: 267,
      deliveryTime: "20-30 min",
      deliveryFee: 2.49,
      image: "http://localhost:5000/api/food/moroccan?width=300&height=200",
      badge: "New",
      cuisine: "Moroccan",
      specialties: ["Tagine", "Couscous", "Pastilla"],
    },
    {
      id: 4,
      name: "Ghana Gold",
      rating: 4.5,
      reviewCount: 156,
      deliveryTime: "35-45 min",
      deliveryFee: 3.99,
      image: "http://localhost:5000/api/food/ghanaian?width=300&height=200",
      badge: "Highly Rated",
      cuisine: "Ghanaian",
      specialties: ["Banku", "Kelewele", "Fufu"],
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Amara Johnson",
      location: "Brixton, London",
      rating: 5,
      text: "ChopNow has brought the authentic taste of home to my doorstep. The Nigerian restaurants here are incredible!",
      image: "http://localhost:5000/api/avatar/amara?width=60&height=60",
      orderCount: 47
    },
    {
      id: 2,
      name: "Kwame Asante",
      location: "Peckham, London",
      rating: 5,
      text: "Fast delivery and amazing Ghanaian food. The kelewele from Ghana Gold is exactly like my grandmother's!",
      image: "http://localhost:5000/api/avatar/kwame?width=60&height=60",
      orderCount: 23
    },
    {
      id: 3,
      name: "Fatima Al-Hassan",
      location: "Camden, London",
      rating: 5,
      text: "Best Ethiopian food in London! The injera is fresh and the delivery is always on time.",
      image: "http://localhost:5000/api/avatar/fatima?width=60&height=60",
      orderCount: 31
    },
    {
      id: 4,
      name: "David Thompson",
      location: "Shoreditch, London",
      rating: 5,
      text: "Love exploring African cuisines through ChopNow. Every meal is an adventure!",
      image: "http://localhost:5000/api/avatar/david?width=60&height=60",
      orderCount: 18
    },
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: "Search & Discover",
      description: "Browse restaurants by location, cuisine, or find specific dishes and promotions",
      icon: MagnifyingGlassIcon,
      color: "from-orange-500 to-red-500"
    },
    {
      step: 2,
      title: "Choose & Customize",
      description: "Select your favorite meals and customize them to your taste preferences",
      icon: HeartIcon,
      color: "from-amber-500 to-orange-500"
    },
    {
      step: 3,
      title: "Order & Pay",
      description: "Secure checkout with multiple payment options and real-time order confirmation",
      icon: CreditCardIcon,
      color: "from-green-500 to-emerald-500"
    },
    {
      step: 4,
      title: "Track & Enjoy",
      description: "Live tracking from kitchen to your door with estimated delivery time",
      icon: TruckIcon,
      color: "from-blue-500 to-indigo-500"
    },
  ];

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Testimonial carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Simulate live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveUpdates(prev => ({
        ...prev,
        activeOrders: prev.activeOrders + Math.floor(Math.random() * 3),
        deliveryTime: `${20 + Math.floor(Math.random() * 15)} min avg`
      }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Handle location selection
  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setCurrentLocation(location.address);
  };

  // Handle restaurant filter changes
  const handleFiltersChange = (filters: any) => {
    setRestaurantFilters(filters);
  };

  // Handle search changes with type
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle advanced search
  const handleAdvancedSearch = () => {
    if (searchQuery.trim()) {
      setActiveTab("restaurants");
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use reverse geocoding
          setCurrentLocation("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "restaurants":
        return (
          <div className="space-y-6">
            {/* Search Header */}
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
              <h2 className="text-3xl font-bold text-orange-800 mb-4">
                Browse Restaurants
              </h2>
              {searchQuery && (
                <p className="text-orange-600 mb-4">
                  Showing results for "{searchQuery}"
                </p>
              )}
              <RestaurantFilters
                onSearchChange={handleSearchChange}
                onFiltersChange={handleFiltersChange}
                initialSearch={searchQuery}
              />
            </div>
            <RestaurantGrid
              filters={restaurantFilters}
              searchQuery={searchQuery}
            />
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
              <h2 className="text-2xl font-bold text-orange-800 mb-2">
                Your Orders
              </h2>
              <p className="text-orange-600">
                Track your current and past orders
              </p>
            </div>
            <OrderTracker userId={user?.id} />
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
              <h2 className="text-2xl font-bold text-orange-800 mb-2">
                Your Profile
              </h2>
              <p className="text-orange-600">
                Manage your account settings and preferences
              </p>
            </div>
            {user && <UserProfile user={user} />}
          </div>
        );

      default:
        return (
          <div className="space-y-0">
            {/* Live Updates Banner */}
            <section className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white py-2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center space-x-8 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <BellIcon className="h-4 w-4" />
                    <span>{liveUpdates.activeOrders} active orders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FireIcon className="h-4 w-4" />
                    <span>Trending: {liveUpdates.trendingDishes[0]}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-4 w-4" />
                    <span>{liveUpdates.activePromotions} active promotions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="h-4 w-4" />
                    <span>{liveUpdates.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Enhanced Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 text-8xl opacity-10 animate-bounce">🌍</div>
                <div className="absolute bottom-20 right-20 text-8xl opacity-10 animate-pulse">🍽️</div>
                <div className="absolute top-1/2 right-40 text-6xl opacity-5 animate-float">🥘</div>
                <div className="absolute top-32 right-80 text-5xl opacity-10 animate-bounce">🍛</div>
                <div className="absolute bottom-40 left-40 text-7xl opacity-5 animate-pulse">🍖</div>
              </div>

              <div className="relative z-10 px-6 py-24 md:py-32 text-center text-white">
                <div className="max-w-6xl mx-auto">
                  {/* Main Headline */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in">
                    Authentic African Cuisine
                    <span className="block text-amber-200 mt-4">
                      Delivered Fresh
                    </span>
                  </h1>
                  
                  {/* Tagline */}
                  <p className="text-xl md:text-3xl mb-12 text-orange-100 max-w-4xl mx-auto leading-relaxed animate-slide-up">
                    Experience the rich flavors of Africa, delivered straight to your door in under 30 minutes. From Nigerian Jollof to Ethiopian Injera - taste the continent.
                  </p>

                  {/* Advanced Search Bar */}
                  <div className="max-w-4xl mx-auto mb-12 animate-slide-up">
                    <div className="bg-white rounded-2xl p-4 shadow-2xl">
                      <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-3">
                        {/* Search Type Selector */}
                        <div className="flex-shrink-0">
                          <Select value={searchType} onValueChange={setSearchType}>
                            <SelectTrigger className="w-48 border-0 focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">🔍 All</SelectItem>
                              <SelectItem value="city">🏙️ City</SelectItem>
                              <SelectItem value="restaurant">🏪 Restaurant</SelectItem>
                              <SelectItem value="cuisine">🍽️ Cuisine</SelectItem>
                              <SelectItem value="promotion">🎁 Promotion</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Main Search Input */}
                        <div className="flex-1 flex items-center">
                          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 ml-4" />
                          <Input
                            placeholder={`Search ${searchType === 'all' ? 'restaurants, cuisines, or dishes' : 
                              searchType === 'city' ? 'by city (e.g., London, Birmingham)' :
                              searchType === 'restaurant' ? 'restaurant name' :
                              searchType === 'cuisine' ? 'cuisine type (e.g., Nigerian, Ethiopian)' :
                              'promotion codes or offers'}...`}
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="border-0 focus:ring-0 text-gray-900 placeholder-gray-500 text-xl py-4 px-4"
                            onKeyPress={(e) => e.key === 'Enter' && handleAdvancedSearch()}
                          />
                        </div>
                        
                        {/* Search Button */}
                        <Button 
                          size="lg" 
                          className="bg-orange-600 hover:bg-orange-700 rounded-xl px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
                          onClick={handleAdvancedSearch}
                        >
                          Search
                          <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="max-w-lg mx-auto mb-12 animate-slide-up">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                      <div className="flex items-center justify-center text-white mb-3">
                        <MapPinIcon className="h-6 w-6 mr-3" />
                        <span className="text-lg font-medium">Deliver to:</span>
                      </div>
                      <div className="text-amber-200 text-xl font-semibold mb-4">
                        {currentLocation}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          variant="outline"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all"
                          onClick={() => setShowLocationModal(true)}
                        >
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Change Location
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all"
                          onClick={getCurrentLocation}
                        >
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Use Current Location
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  {!isAuthenticated && (
                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
                      <Button
                        size="lg"
                        className="bg-white text-orange-600 hover:bg-orange-50 px-12 py-4 text-xl font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
                        onClick={() => (window.location.href = "/auth/register")}
                      >
                        Get Started Free
                        <ArrowRightIcon className="ml-3 h-6 w-6" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-12 py-4 text-xl font-semibold rounded-xl transition-all hover:scale-105"
                        onClick={() => (window.location.href = "/auth/login")}
                      >
                        Sign In
                      </Button>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="animate-slide-up">
                      <Button
                        size="lg"
                        className="bg-white text-orange-600 hover:bg-orange-50 px-12 py-4 text-xl font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
                        onClick={() => setActiveTab("restaurants")}
                      >
                        Start Ordering
                        <ArrowRightIcon className="ml-3 h-6 w-6" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Featured Restaurants Carousel */}
            <section className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-orange-800 mb-4">
                    Featured Restaurants
                  </h2>
                  <p className="text-xl text-orange-600">
                    Top-rated African restaurants in your area
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topRestaurants.map((restaurant) => (
                    <Card
                      key={restaurant.id}
                      className="border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 group-hover:scale-105 transition-transform">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl">🍽️</span>
                        </div>
                        {restaurant.badge && (
                          <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                            {restaurant.badge}
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center space-x-1">
                          <StarSolidIcon className="h-4 w-4 text-amber-400" />
                          <span className="text-sm font-semibold">{restaurant.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-orange-800 text-lg mb-2">
                          {restaurant.name}
                        </h3>
                        <p className="text-orange-600 text-sm mb-3">
                          {restaurant.cuisine} • {restaurant.specialties?.slice(0, 2).join(", ")}
                        </p>
                        <div className="flex items-center justify-between text-sm text-orange-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{restaurant.deliveryTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserGroupIcon className="h-4 w-4" />
                            <span>{restaurant.reviewCount} reviews</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-orange-500">
                            Delivery £{restaurant.deliveryFee}
                          </span>
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Order Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8"
                    onClick={() => setActiveTab("restaurants")}
                  >
                    View All Restaurants
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Promotions & Special Offers */}
            <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-orange-800 mb-4">
                    Special Offers & Promotions
                  </h2>
                  <p className="text-xl text-orange-600">
                    Limited-time deals you don't want to miss
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {specialOffers.map((offer) => (
                    <Card
                      key={offer.id}
                      className="border-orange-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className={`h-40 bg-gradient-to-r ${
                        offer.type === 'percentage' ? 'from-orange-400 to-red-400' :
                        offer.type === 'free_delivery' ? 'from-green-400 to-emerald-400' :
                        'from-purple-400 to-indigo-400'
                      } flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 text-center text-white">
                          <div className="text-5xl font-bold mb-2">
                            {offer.type === 'percentage' ? `${offer.discount}%` :
                             offer.type === 'free_delivery' ? 'FREE' : '15%'}
                          </div>
                          <div className="text-lg font-semibold">
                            {offer.type === 'percentage' ? 'OFF' :
                             offer.type === 'free_delivery' ? 'DELIVERY' : 'OFF'}
                          </div>
                        </div>
                        <GiftIcon className="h-16 w-16 text-white/20 absolute top-4 right-4" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-orange-800 mb-2 text-lg">
                          {offer.title}
                        </h3>
                        <p className="text-orange-600 text-sm mb-4">
                          {offer.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-orange-500">
                            Valid until {new Date(offer.validUntil).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-orange-800">
                              {offer.code}
                            </span>
                            <Button size="sm" variant="outline" className="text-xs">
                              Copy Code
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8"
                  >
                    View All Promotions
                    <TagIcon className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Browse by Categories */}
            <section className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-orange-800 mb-4">
                    Browse by Cuisine
                  </h2>
                  <p className="text-xl text-orange-600">
                    Discover authentic flavors from across Africa
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {featuredCategories.map((category) => (
                    <Card
                      key={category.name}
                      className="border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 relative"
                      onClick={() => {
                        setActiveTab("restaurants");
                        setRestaurantFilters({
                          ...restaurantFilters,
                          cuisine: [category.name],
                        });
                      }}
                    >
                      {category.trending && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white z-10 animate-pulse">
                          Hot
                        </Badge>
                      )}
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                          {category.icon}
                        </div>
                        <h3 className="font-semibold text-orange-800 group-hover:text-orange-600 transition-colors mb-1 text-sm">
                          {category.name}
                        </h3>
                        <p className="text-xs text-orange-500">
                          {category.count} restaurants
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-gradient-to-br from-orange-600 to-amber-600 text-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">
                    How ChopNow Works
                  </h2>
                  <p className="text-xl text-orange-100">
                    From craving to satisfaction in 4 simple steps
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {howItWorksSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.step} className="text-center relative">
                        {index < howItWorksSteps.length - 1 && (
                          <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-white/30 transform -translate-y-1/2"></div>
                        )}
                        <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-xl`}>
                          <Icon className="h-12 w-12 text-white" />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                        </div>
                        <h3 className="font-bold text-xl mb-3">
                          {step.title}
                        </h3>
                        <p className="text-orange-100 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Customer Testimonials */}
            <section className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-orange-800 mb-4">
                    What Our Customers Say
                  </h2>
                  <p className="text-xl text-orange-600">
                    Real reviews from real food lovers
                  </p>
                </div>

                <div className="relative">
                  <div className="overflow-hidden">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                    >
                      {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                          <Card className="border-orange-200 max-w-4xl mx-auto">
                            <CardContent className="p-8 text-center">
                              <div className="flex justify-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <StarSolidIcon key={i} className="h-6 w-6 text-amber-400" />
                                ))}
                              </div>
                              <blockquote className="text-xl text-gray-700 mb-6 italic">
                                "{testimonial.text}"
                              </blockquote>
                              <div className="flex items-center justify-center space-x-4">
                                <img
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="text-left">
                                  <div className="font-semibold text-orange-800">
                                    {testimonial.name}
                                  </div>
                                  <div className="text-orange-600 text-sm">
                                    {testimonial.location}
                                  </div>
                                  <div className="text-orange-500 text-xs">
                                    {testimonial.orderCount} orders placed
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="flex justify-center space-x-2 mt-8">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentTestimonial === index ? 'bg-orange-600' : 'bg-orange-200'
                        }`}
                        onClick={() => setCurrentTestimonial(index)}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 rounded-full border-orange-200"
                    onClick={() => setCurrentTestimonial((prev) => 
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 rounded-full border-orange-200"
                    onClick={() => setCurrentTestimonial((prev) => 
                      (prev + 1) % testimonials.length
                    )}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* App Download Promotion */}
            <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-bold mb-6">
                      Get the ChopNow App
                    </h2>
                    <p className="text-xl text-purple-100 mb-8">
                      Download our mobile app for even faster ordering, exclusive app-only deals, and seamless food delivery experience.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-300" />
                        <span>Faster checkout and reorder favorites</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-300" />
                        <span>Exclusive app-only promotions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-300" />
                        <span>Real-time order tracking notifications</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-300" />
                        <span>Save multiple delivery addresses</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="bg-black hover:bg-gray-800 text-white px-6 py-3"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                          <div>
                            <div className="text-xs">Download on the</div>
                            <div className="text-sm font-semibold">App Store</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        size="lg"
                        className="bg-black hover:bg-gray-800 text-white px-6 py-3"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                          </svg>
                          <div>
                            <div className="text-xs">Get it on</div>
                            <div className="text-sm font-semibold">Google Play</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="bg-white p-8 rounded-2xl inline-block shadow-2xl">
                      <QrCodeIcon className="h-48 w-48 text-gray-800 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">
                        Scan to Download
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose ChopNow */}
            <section className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-orange-800 mb-4">
                    Why Choose ChopNow?
                  </h2>
                  <p className="text-xl text-orange-600">
                    We're not just another food delivery app
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <Card className="border-orange-200 text-center p-8 hover:shadow-xl transition-all duration-300 group">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <SparklesIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-orange-800 mb-3 text-xl">
                      Authentic Flavors
                    </h3>
                    <p className="text-orange-600">
                      Traditional recipes and authentic ingredients from family-owned African restaurants
                    </p>
                  </Card>
                  
                  <Card className="border-orange-200 text-center p-8 hover:shadow-xl transition-all duration-300 group">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <TruckIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-orange-800 mb-3 text-xl">
                      Lightning Fast
                    </h3>
                    <p className="text-orange-600">
                      Average delivery time of 25 minutes with real-time tracking from kitchen to your door
                    </p>
                  </Card>
                  
                  <Card className="border-orange-200 text-center p-8 hover:shadow-xl transition-all duration-300 group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <ShieldCheckIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-orange-800 mb-3 text-xl">
                      Quality Guaranteed
                    </h3>
                    <p className="text-orange-600">
                      Verified restaurants, fresh ingredients, and 100% satisfaction guarantee on every order
                    </p>
                  </Card>
                  
                  <Card className="border-orange-200 text-center p-8 hover:shadow-xl transition-all duration-300 group">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <CreditCardIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-orange-800 mb-3 text-xl">
                      Secure & Easy
                    </h3>
                    <p className="text-orange-600">
                      Multiple payment options, secure checkout, and hassle-free ordering experience
                    </p>
                  </Card>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Sticky Header */}
      <header className={`bg-white shadow-sm border-b border-orange-200 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-lg' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <h1 className="text-2xl font-bold text-orange-800">ChopNow</h1>
              </div>
              <Badge className="bg-orange-100 text-orange-800 hidden sm:block">
                🌍 African Food Delivery
              </Badge>
              
              {/* Location Display in Header */}
              {currentLocation && (
                <Button
                  variant="ghost"
                  onClick={() => setShowLocationModal(true)}
                  className="hidden lg:flex items-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                >
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span className="max-w-48 truncate">{currentLocation}</span>
                </Button>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Button
                variant={activeTab === "home" ? "default" : "ghost"}
                onClick={() => setActiveTab("home")}
                className={`rounded-lg transition-all ${
                  activeTab === "home" 
                    ? "bg-orange-600 hover:bg-orange-700 text-white" 
                    : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                }`}
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                variant={activeTab === "restaurants" ? "default" : "ghost"}
                onClick={() => setActiveTab("restaurants")}
                className={`rounded-lg transition-all ${
                  activeTab === "restaurants" 
                    ? "bg-orange-600 hover:bg-orange-700 text-white" 
                    : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                }`}
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Restaurants
              </Button>
              
              <Button
                variant="ghost"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
              >
                <TagIcon className="h-4 w-4 mr-2" />
                Promotions
              </Button>
              
              <Button
                variant="ghost"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
              >
                How It Works
              </Button>
              
              {isAuthenticated && (
                <>
                  <Button
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    onClick={() => setActiveTab("orders")}
                    className={`rounded-lg transition-all ${
                      activeTab === "orders" 
                        ? "bg-orange-600 hover:bg-orange-700 text-white" 
                        : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    }`}
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    onClick={() => setActiveTab("profile")}
                    className={`rounded-lg transition-all ${
                      activeTab === "profile" 
                        ? "bg-orange-600 hover:bg-orange-700 text-white" 
                        : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    }`}
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(activeTab === "mobile-menu" ? "home" : "mobile-menu")}
                  className="text-orange-600 hover:bg-orange-50 rounded-lg"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-orange-800 font-medium">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/auth/login")}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/auth/register")}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                  >
                    Order Now
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {activeTab === "mobile-menu" && (
            <div className="md:hidden border-t border-orange-200 py-4 mt-4 animate-slide-up">
              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("home")}
                  className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                >
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("restaurants")}
                  className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Browse Restaurants
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                >
                  <TagIcon className="h-4 w-4 mr-2" />
                  Promotions
                </Button>
                {currentLocation && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowLocationModal(true)}
                    className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                  >
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Change Location ({currentLocation})
                  </Button>
                )}
                {isAuthenticated && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab("orders")}
                      className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      My Orders
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab("profile")}
                      className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <h3 className="text-xl font-bold">ChopNow</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Authentic African cuisine delivered fresh to your doorstep. 
                Experience the rich flavors and traditions of Africa, one meal at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-400">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "How It Works",
                  "Browse Restaurants",
                  "Become a Partner",
                  "Join as Rider",
                  "Help Center"
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-400">Customer Service</h4>
              <ul className="space-y-2">
                {[
                  "Contact Us",
                  "Order Tracking",
                  "Cancel Order",
                  "Food Safety",
                  "Report Issue",
                  "Feedback"
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-400">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-orange-400" />
                  <span className="text-gray-300">+44 20 7946 0958</span>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-orange-400" />
                  <span className="text-gray-300">hello@chopnow.co.uk</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-orange-400 mt-1" />
                  <span className="text-gray-300">
                    123 Foodie Street<br />
                    London, UK EC1A 1BB
                  </span>
                </div>
              </div>
              
              {/* App Download */}
              <div className="pt-4">
                <h5 className="text-sm font-semibold text-gray-200 mb-3">Download Our App</h5>
                <div className="flex flex-col space-y-2">
                  <a href="#" className="inline-block">
                    <img 
                      src="/api/placeholder/120/40" 
                      alt="Download on App Store" 
                      className="h-10 rounded-md"
                    />
                  </a>
                  <a href="#" className="inline-block">
                    <img 
                      src="/api/placeholder/120/40" 
                      alt="Get it on Google Play" 
                      className="h-10 rounded-md"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-300 text-sm">
                © 2024 ChopNow. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Cookie Policy
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <GlobeAltIcon className="h-4 w-4" />
                <span>English (UK)</span>
                <span className="text-gray-500">|</span>
                <span>£ GBP</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={currentLocation}
      />
    </div>
  );
}
