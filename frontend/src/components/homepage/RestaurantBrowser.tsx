'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RestaurantFilters from './RestaurantFilters';
import LocationPicker from './LocationPicker';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  image: string;
  distance: number;
  isOpen: boolean;
  isFavorite: boolean;
  tags: string[];
  address: string;
  description: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'current' | 'saved' | 'popular';
}

interface RestaurantBrowserProps {
  onRestaurantSelect: (restaurant: Restaurant) => void;
  selectedLocation?: Location | null;
}

export default function RestaurantBrowser({ onRestaurantSelect, selectedLocation }: RestaurantBrowserProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(selectedLocation || null);
  const [filters, setFilters] = useState<any>({
    cuisine: [],
    priceRange: [],
    deliveryTime: [],
    rating: 0,
    isOpen: false,
    tags: []
  });

  // Mock restaurant data with African theme
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: "Mama Afrika's Kitchen",
      cuisine: 'West African',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      minimumOrder: 15.00,
      image: '/api/placeholder/restaurant/west-african',
      distance: 0.8,
      isOpen: true,
      isFavorite: false,
      tags: ['Halal', 'Vegetarian Options', 'Popular'],
      address: '123 Lagos Street, Peckham',
      description: 'Authentic West African cuisine with traditional jollof rice and grilled meats'
    },
    {
      id: '2',
      name: 'Ethiopian Delights',
      cuisine: 'Ethiopian',
      rating: 4.6,
      deliveryTime: '30-40 min',
      deliveryFee: 3.49,
      minimumOrder: 20.00,
      image: '/api/placeholder/restaurant/ethiopian',
      distance: 1.2,
      isOpen: true,
      isFavorite: false,
      tags: ['Vegan Friendly', 'Spicy', 'Traditional'],
      address: '456 Addis Road, Brixton',
      description: 'Traditional Ethiopian dishes served with injera bread and authentic spice blends'
    },
    {
      id: '3',
      name: 'Cape Town Corner',
      cuisine: 'South African',
      rating: 4.7,
      deliveryTime: '20-30 min',
      deliveryFee: 2.49,
      minimumOrder: 12.00,
      image: '/api/placeholder/restaurant/south-african',
      distance: 0.5,
      isOpen: true,
      isFavorite: false,
      tags: ['Braai', 'Comfort Food', 'Family Owned'],
      address: '789 Cape Street, Elephant & Castle',
      description: 'South African braai and comfort food bringing the taste of the Rainbow Nation'
    },
    {
      id: '4',
      name: 'Nile Valley Restaurant',
      cuisine: 'North African',
      rating: 4.5,
      deliveryTime: '35-45 min',
      deliveryFee: 3.99,
      minimumOrder: 18.00,
      image: '/api/placeholder/restaurant/north-african',
      distance: 1.8,
      isOpen: false,
      isFavorite: false,
      tags: ['Mediterranean', 'Halal', 'Fresh'],
      address: '321 Nile Avenue, Dalston',
      description: 'Fresh North African and Mediterranean dishes with aromatic herbs and spices'
    },
    {
      id: '5',
      name: 'Lagos Lounge',
      cuisine: 'Nigerian',
      rating: 4.9,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      minimumOrder: 16.00,
      image: '/api/placeholder/restaurant/nigerian',
      distance: 1.0,
      isOpen: true,
      isFavorite: false,
      tags: ['Suya', 'Jollof', 'Popular', 'Late Night'],
      address: '654 Victoria Island Road, Tottenham',
      description: 'Premium Nigerian cuisine featuring the best suya and jollof rice in London'
    },
    {
      id: '6',
      name: 'Zanzibar Spice House',
      cuisine: 'East African',
      rating: 4.4,
      deliveryTime: '30-40 min',
      deliveryFee: 3.29,
      minimumOrder: 17.00,
      image: '/api/placeholder/restaurant/east-african',
      distance: 1.5,
      isOpen: true,
      isFavorite: false,
      tags: ['Swahili', 'Seafood', 'Coconut'],
      address: '987 Spice Route, Southwark',
      description: 'East African coastal cuisine with fresh seafood and aromatic coconut curries'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
      setIsLoading(false);
    }, 1000);

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('chop-now-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Handle filter changes
  useEffect(() => {
    handleFilter(filters);
  }, [filters, searchQuery, restaurants]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      restaurant.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRestaurants(filtered);
  };

  const handleFilter = (filters: any) => {
    let filtered = [...restaurants];

    // Apply search query first
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.cuisine.length > 0) {
      filtered = filtered.filter(restaurant =>
        filters.cuisine.includes(restaurant.cuisine)
      );
    }

    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(restaurant => {
        if (filters.priceRange.includes('budget') && restaurant.minimumOrder <= 15) return true;
        if (filters.priceRange.includes('mid-range') && restaurant.minimumOrder > 15 && restaurant.minimumOrder <= 25) return true;
        if (filters.priceRange.includes('premium') && restaurant.minimumOrder > 25) return true;
        return false;
      });
    }

    if (filters.deliveryTime.length > 0) {
      filtered = filtered.filter(restaurant => {
        const maxTime = parseInt(restaurant.deliveryTime.split('-')[1]);
        if (filters.deliveryTime.includes('fast') && maxTime <= 30) return true;
        if (filters.deliveryTime.includes('medium') && maxTime > 30 && maxTime <= 45) return true;
        if (filters.deliveryTime.includes('slow') && maxTime > 45) return true;
        return false;
      });
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(restaurant => restaurant.rating >= filters.rating);
    }

    if (filters.isOpen) {
      filtered = filtered.filter(restaurant => restaurant.isOpen);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(restaurant =>
        filters.tags.some((tag: string) => restaurant.tags.includes(tag))
      );
    }

    setFilteredRestaurants(filtered);
  };

  const toggleFavorite = (restaurantId: string) => {
    const newFavorites = favorites.includes(restaurantId)
      ? favorites.filter(id => id !== restaurantId)
      : [...favorites, restaurantId];
    
    setFavorites(newFavorites);
    localStorage.setItem('chop-now-favorites', JSON.stringify(newFavorites));
  };

  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
    setShowLocationPicker(false);
    
    // Here you would typically refetch restaurants based on the new location
    console.log('Selected location:', location);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding the best African restaurants near you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location and Search Header */}
      <div className="space-y-4">
        {/* Location Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 p-2"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
          >
            <MapPinIcon className="h-5 w-5" />
            <span className="font-medium">
              {currentLocation ? currentLocation.name : 'Select Location'}
            </span>
          </Button>
        </div>

        {/* Location Picker */}
        {showLocationPicker && (
          <div className="mb-4">
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              selectedLocation={currentLocation}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 border-orange-200 focus:border-orange-400"
          />
        </div>
      </div>

      {/* Filters */}
      <RestaurantFilters
        onSearchChange={setSearchQuery}
        onFiltersChange={setFilters}
      />

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-orange-800">
          {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''} Available
        </h2>
        {currentLocation && (
          <span className="text-sm text-gray-600">
            Near {currentLocation.name}
          </span>
        )}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Card 
            key={restaurant.id} 
            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-orange-100"
            onClick={() => onRestaurantSelect(restaurant)}
          >
            <div className="relative">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(restaurant.id);
                }}
              >
                {favorites.includes(restaurant.id) ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
              </Button>
              {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary" className="bg-red-500 text-white">
                    Closed
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{restaurant.name}</h3>
                  <p className="text-orange-600 font-medium">{restaurant.cuisine}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{restaurant.description}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{restaurant.distance}km</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    Delivery: £{restaurant.deliveryFee.toFixed(2)}
                  </span>
                  <span className="text-gray-600">
                    Min: £{restaurant.minimumOrder.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {restaurant.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-orange-100 text-orange-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No restaurants found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters to find more options
          </p>
          <Button 
            onClick={() => {
              setSearchQuery('');
              setFilteredRestaurants(restaurants);
            }}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
