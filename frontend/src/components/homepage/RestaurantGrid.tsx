'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon, ClockIcon, TruckIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { restaurantApi, Restaurant } from '@/lib/api';

interface RestaurantGridProps {
  filters: any;
  searchQuery: string;
}

export default function RestaurantGrid({ filters, searchQuery }: RestaurantGridProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: 1,
          limit: 20,
          sortBy: 'rating',
          sortOrder: 'desc'
        };

        // Add search query
        if (searchQuery) {
          params.search = searchQuery;
        }

        // Add location if available
        if (currentLocation) {
          params.latitude = currentLocation.lat;
          params.longitude = currentLocation.lng;
          params.radius = 15; // 15km radius
        }

        // Add filters
        if (filters.cuisine && filters.cuisine !== 'all') {
          params.cuisine = filters.cuisine;
        }
        if (filters.minRating) {
          params.minRating = filters.minRating;
        }
        if (filters.maxDeliveryTime) {
          params.maxDeliveryTime = filters.maxDeliveryTime;
        }
        if (filters.isOpen) {
          params.isOpen = true;
        }
        if (filters.sortBy) {
          params.sortBy = filters.sortBy;
          params.sortOrder = filters.sortOrder || 'asc';
        }

        const response = await restaurantApi.getRestaurants(params);
        setRestaurants(response.data || []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        // Fallback to mock data if API fails
        setRestaurants(getMockRestaurants());
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [filters, searchQuery, currentLocation]);

  // Mock data fallback
  const getMockRestaurants = (): Restaurant[] => [
    {
      id: '1',
      name: "Mama Afrika's Kitchen",
      cuisine: 'Nigerian',
      description: "Authentic Nigerian cuisine with modern twist",
      address: "123 Lagos Street, London",
      phone: "+44 20 1234 5678",
      image: "http://localhost:5000/api/food/nigerian?width=300&height=200",
      latitude: 51.5074,
      longitude: -0.1278,
      rating: 4.8,
      deliveryFee: 2.99,
      minimumOrder: 15,
      deliveryTime: "25-35 min",
      isOpen: true,
      isFavorite: false,
      distance: 2.5,
      reviewCount: 245,
      tags: ['Halal', 'Popular'],
      sampleMenuItems: [
        {
          id: '1',
          name: 'Jollof Rice',
          price: 12.99
        }
      ]
    },
    {
      id: '2',
      name: "Ethiopian Delights",
      cuisine: 'Ethiopian',
      description: "Traditional Ethiopian food and injera",
      address: "456 Addis Road, London",
      phone: "+44 20 2345 6789",
      image: "http://localhost:5000/api/food/ethiopian?width=300&height=200",
      latitude: 51.5074,
      longitude: -0.1278,
      rating: 4.6,
      deliveryFee: 3.49,
      minimumOrder: 18,
      deliveryTime: "30-40 min",
      isOpen: true,
      isFavorite: false,
      distance: 3.2,
      reviewCount: 189,
      tags: ['Vegetarian', 'Traditional'],
      sampleMenuItems: [
        {
          id: '2',
          name: 'Injera with Doro Wat',
          price: 15.99
        }
      ]
    },
    {
      id: '3',
      name: "Accra Gold Restaurant",
      cuisine: 'Ghanaian',
      description: "Ghanaian specialties and fresh seafood",
      address: "789 Accra Avenue, London",
      phone: "+44 20 3456 7890",
      image: "http://localhost:5000/api/food/ghanaian?width=300&height=200",
      latitude: 51.5074,
      longitude: -0.1278,
      rating: 4.7,
      deliveryFee: 2.49,
      minimumOrder: 20,
      deliveryTime: "20-30 min",
      isOpen: true,
      isFavorite: false,
      distance: 1.8,
      reviewCount: 312,
      tags: ['Seafood', 'Popular'],
      sampleMenuItems: [
        {
          id: '3',
          name: 'Banku with Tilapia',
          price: 18.99
        }
      ]
    }
  ];

  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const getDeliveryFeeDisplay = (fee: number) => {
    return fee === 0 ? 'Free delivery' : `£${fee.toFixed(2)} delivery`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-orange-100 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-orange-100 rounded mb-2"></div>
              <div className="h-3 bg-orange-50 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-orange-50 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-orange-800 mb-2">No restaurants found</h3>
        <p className="text-orange-600 mb-4">Try adjusting your filters or search criteria</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-orange-500 hover:bg-orange-600"
        >
          Refresh Results
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="group hover:shadow-xl transition-all duration-300 border-orange-100 overflow-hidden">
          <div className="relative">
            <div className="h-48 overflow-hidden">
              <Image
                src={restaurant.imageUrl || 'http://localhost:5000/api/placeholder/300/200?text=Restaurant&bg=ff8c00&color=ffffff'}
                alt={restaurant.name}
                width={300}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(restaurant.id);
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              {favorites.includes(restaurant.id) ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-orange-600" />
              )}
            </button>

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              {restaurant.isOpen ? (
                <Badge className="bg-green-500 text-white">Open</Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-500 text-white">Closed</Badge>
              )}
            </div>

            {/* Distance Badge */}
            {restaurant.distance && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {formatDistance(restaurant.distance)}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-orange-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                <StarIcon className="h-4 w-4 text-orange-500 fill-current" />
                <span className="text-sm font-medium text-orange-700">
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <p className="text-orange-600 text-sm mb-3 line-clamp-2">
              {restaurant.description}
            </p>

            <div className="flex items-center justify-between text-sm text-orange-600 mb-3">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{restaurant.deliveryTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <TruckIcon className="h-4 w-4" />
                <span>{getDeliveryFeeDisplay(restaurant.deliveryFee)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-orange-500 mb-3">
              <span>Min order: £{restaurant.minOrder}</span>
              <span>{restaurant.reviewCount} reviews</span>
            </div>

            {/* Sample menu items */}
            {restaurant.sampleMenuItems && restaurant.sampleMenuItems.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-orange-600 mb-1">Popular items:</p>
                <div className="flex gap-1 flex-wrap">
                  {restaurant.sampleMenuItems?.slice(0, 3).map((item: any) => (
                    <Badge key={item.id} variant="outline" className="text-xs border-orange-200 text-orange-700">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {
                // Navigate to restaurant detail page
                window.location.href = `/restaurant/${restaurant.id}`;
              }}
            >
              View Menu
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
