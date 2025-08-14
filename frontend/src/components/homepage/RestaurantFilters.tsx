'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/outline';

interface RestaurantFiltersProps {
  onSearchChange?: (query: string) => void;
  onFiltersChange?: (filters: any) => void;
  initialSearch?: string;
}

export default function RestaurantFilters({ 
  onSearchChange, 
  onFiltersChange,
  initialSearch = ''
}: RestaurantFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState<any>({
    cuisine: [],
    priceRange: [],
    deliveryTime: [],
    rating: 0,
    isOpen: false,
    tags: [],
    sortBy: '',
    maxDeliveryTime: 60,
    minRating: 0
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Update search query when initialSearch changes
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  // Call callbacks when filters or search change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
  }, [searchQuery, onSearchChange]);

  const cuisineTypes = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'nigerian', label: 'Nigerian' },
    { value: 'ethiopian', label: 'Ethiopian' },
    { value: 'ghanaian', label: 'Ghanaian' },
    { value: 'moroccan', label: 'Moroccan' },
    { value: 'kenyan', label: 'Kenyan' },
    { value: 'south-african', label: 'South African' },
    { value: 'african-fusion', label: 'African Fusion' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'deliveryTime', label: 'Fastest Delivery' },
    { value: 'deliveryFee', label: 'Lowest Delivery Fee' },
    { value: 'distance', label: 'Nearest' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-15', label: '£0 - £15' },
    { value: '15-25', label: '£15 - £25' },
    { value: '25-35', label: '£25 - £35' },
    { value: '35+', label: '£35+' }
  ];

  const deliveryTimes = [
    { value: 'all', label: 'Any Time' },
    { value: '15', label: 'Under 15 min' },
    { value: '30', label: 'Under 30 min' },
    { value: '45', label: 'Under 45 min' },
    { value: '60', label: 'Under 1 hour' }
  ];

  const quickFilters = [
    { id: 'isOpen', label: 'Open Now', icon: '🟢' },
    { id: 'freeDelivery', label: 'Free Delivery', icon: '🚚' },
    { id: 'fastDelivery', label: 'Fast Delivery', icon: '⚡' },
    { id: 'topRated', label: 'Top Rated', icon: '⭐' },
    { id: 'newRestaurants', label: 'New', icon: '✨' }
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    setFilters({
      cuisine: [],
      priceRange: [],
      deliveryTime: [],
      rating: 0,
      isOpen: false,
      tags: [],
      sortBy: '',
      maxDeliveryTime: 60,
      minRating: 0
    });
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => 
      filters[key] && filters[key] !== 'all' && filters[key] !== ''
    ).length;
  };

  return (
    <div className="bg-white border-b border-orange-100 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-11 border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge className="ml-2 bg-orange-500 text-white">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="h-11 text-orange-600 hover:bg-orange-50"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={filters[filter.id] ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(filter.id, !filters[filter.id])}
              className={`${
                filters[filter.id]
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card className="border-orange-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Cuisine Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <Select
                    value={filters.sortBy || 'rating'}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="All Cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map((cuisine) => (
                        <SelectItem key={cuisine.value} value={cuisine.value}>
                          {cuisine.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy || 'rating'}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <Select
                    value={filters.sortBy || 'rating'}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                  >
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <Select
                    value={filters.sortBy || 'rating'}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryTimes.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[4.0, 4.2, 4.5, 4.7, 4.9].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.rating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`${
                        filters.rating === rating
                          ? 'bg-orange-500 text-white'
                          : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <StarIcon className="h-3 w-3 mr-1 fill-current" />
                      {rating}+
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === 'all' || value === '') return null;
              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 flex items-center gap-1"
                >
                  {typeof value === 'string' ? value : key}
                  <button
                    onClick={() => handleFilterChange(key, null)}
                    className="ml-1 hover:text-orange-900"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
