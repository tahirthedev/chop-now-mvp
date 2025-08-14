'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location | null;
}

export default function LocationPicker({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Popular London areas with African communities
  const popularLocations: Location[] = [
    {
      id: 'peckham',
      name: 'Peckham',
      address: 'Peckham, London SE15',
      coordinates: { lat: 51.4689, lng: -0.0689 },
      type: 'popular'
    },
    {
      id: 'brixton',
      name: 'Brixton',
      address: 'Brixton, London SW2',
      coordinates: { lat: 51.4613, lng: -0.1157 },
      type: 'popular'
    },
    {
      id: 'elephant-castle',
      name: 'Elephant & Castle',
      address: 'Elephant & Castle, London SE1',
      coordinates: { lat: 51.4955, lng: -0.0994 },
      type: 'popular'
    },
    {
      id: 'dalston',
      name: 'Dalston',
      address: 'Dalston, London E8',
      coordinates: { lat: 51.5459, lng: -0.0757 },
      type: 'popular'
    },
    {
      id: 'tottenham',
      name: 'Tottenham',
      address: 'Tottenham, London N17',
      coordinates: { lat: 51.5908, lng: -0.0609 },
      type: 'popular'
    },
    {
      id: 'southwark',
      name: 'Southwark',
      address: 'Southwark, London SE1',
      coordinates: { lat: 51.5026, lng: -0.0956 },
      type: 'popular'
    }
  ];

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            id: 'current',
            name: 'Current Location',
            address: 'Your current location',
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            type: 'current'
          };
          setCurrentLocation(location);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }

    setLocations(popularLocations);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setLocations(popularLocations);
      return;
    }

    setIsSearching(true);
    
    // Simulate search API call
    setTimeout(() => {
      const filteredLocations = popularLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      );
      
      // Add some mock search results
      const mockResults: Location[] = [
        {
          id: 'search-1',
          name: query,
          address: `${query}, London`,
          coordinates: { lat: 51.5074, lng: -0.1278 },
          type: 'popular'
        }
      ];

      setLocations([...filteredLocations, ...mockResults]);
      setIsSearching(false);
    }, 500);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'current':
        return '📍';
      case 'saved':
        return '⭐';
      default:
        return '📍';
    }
  };

  return (
    <Card className="w-full max-w-md border-orange-100">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for area or postcode..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Current Location */}
          {currentLocation && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-orange-800">Current Location</h4>
              <Button
                variant="ghost"
                className={`w-full justify-start p-3 h-auto border ${
                  selectedLocation?.id === currentLocation.id
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-200'
                }`}
                onClick={() => onLocationSelect(currentLocation)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getLocationIcon(currentLocation.type)}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{currentLocation.name}</div>
                    <div className="text-sm text-gray-600">{currentLocation.address}</div>
                  </div>
                </div>
              </Button>
            </div>
          )}

          {/* Location Results */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-orange-800">
              {searchQuery.length >= 3 ? 'Search Results' : 'Popular Areas'}
            </h4>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  Searching...
                </div>
              ) : locations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No locations found
                </div>
              ) : (
                locations.map((location) => (
                  <Button
                    key={location.id}
                    variant="ghost"
                    className={`w-full justify-start p-3 h-auto border ${
                      selectedLocation?.id === location.id
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                    onClick={() => onLocationSelect(location)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getLocationIcon(location.type)}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-600">{location.address}</div>
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Manual Address Entry */}
          <div className="pt-2 border-t border-orange-100">
            <Button
              variant="outline"
              className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => {
                const customLocation: Location = {
                  id: 'custom',
                  name: 'Custom Address',
                  address: searchQuery || 'Enter your address',
                  coordinates: { lat: 51.5074, lng: -0.1278 },
                  type: 'popular'
                };
                onLocationSelect(customLocation);
              }}
            >
              <MapPinIcon className="h-4 w-4 mr-2" />
              Enter Address Manually
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
