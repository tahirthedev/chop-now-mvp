'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPinIcon, 
  MagnifyingGlassIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface LocationSelectorProps {
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  currentLocation?: string;
}

export default function LocationSelector({ onLocationSelect, currentLocation }: LocationSelectorProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const popularLocations = [
    { name: 'Brixton', area: 'South London', type: 'neighborhood' },
    { name: 'Peckham', area: 'South London', type: 'neighborhood' },
    { name: 'Shepherds Bush', area: 'West London', type: 'neighborhood' },
    { name: 'Camden', area: 'North London', type: 'neighborhood' },
    { name: 'Elephant & Castle', area: 'South London', type: 'neighborhood' },
    { name: 'Tottenham', area: 'North London', type: 'neighborhood' }
  ];

  const handleLocationSelect = (location: string) => {
    if (onLocationSelect) {
      onLocationSelect({ 
        address: location, 
        lat: 51.5074, 
        lng: -0.1278 
      });
    }
    setIsSearching(false);
    setSearchQuery('');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode this to get the address
          const locationText = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          if (onLocationSelect) {
            onLocationSelect({ 
              address: locationText, 
              lat: latitude, 
              lng: longitude 
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please select manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Deliver authentic African cuisine to your door
          </h2>
          <p className="text-orange-100">
            Enter your address to see restaurants and delivery options in your area
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter your delivery address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <Button 
                onClick={getCurrentLocation}
                variant="outline"
                className="h-12 px-4 border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <MapPinIcon className="h-5 w-5 mr-2" />
                Use Current
              </Button>
            </div>

            {currentLocation && (
              <div className="mb-4 p-3 bg-orange-50 rounded-lg flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  Delivering to: {currentLocation}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (onLocationSelect) {
                      onLocationSelect({ address: '', lat: 0, lng: 0 });
                    }
                  }}
                  className="ml-auto text-orange-600 hover:text-orange-700"
                >
                  Change
                </Button>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-orange-600" />
                Popular Areas in London
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularLocations.map((location) => (
                  <Button
                    key={location.name}
                    variant="ghost"
                    onClick={() => handleLocationSelect(`${location.name}, ${location.area}`)}
                    className="justify-start p-3 h-auto flex-col items-start hover:bg-orange-50 border border-gray-200 hover:border-orange-200"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {location.type === 'neighborhood' ? (
                        <HomeIcon className="h-4 w-4 text-orange-600" />
                      ) : (
                        <BuildingOfficeIcon className="h-4 w-4 text-orange-600" />
                      )}
                      <span className="font-medium text-gray-800">{location.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-6">{location.area}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
