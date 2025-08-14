'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPinIcon, 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  currentLocation?: string;
}

export default function LocationPickerModal({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  currentLocation 
}: LocationPickerModalProps) {
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
    onClose();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (onLocationSelect) {
            onLocationSelect({
              address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              lat: latitude,
              lng: longitude
            });
          }
          onClose();
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please search for your address instead.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-orange-800 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              Choose Location
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for your address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-500"
            />
          </div>

          {/* Current Location Button */}
          <Button
            onClick={getCurrentLocation}
            className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center"
          >
            <MapPinIcon className="h-4 w-4 mr-2" />
            Use Current Location
          </Button>

          {/* Popular Locations */}
          <div>
            <h3 className="font-semibold text-orange-800 mb-3">Popular Areas in London</h3>
            <div className="space-y-2">
              {popularLocations
                .filter(location => 
                  searchQuery === '' || 
                  location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  location.area.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((location) => (
                  <div
                    key={location.name}
                    onClick={() => handleLocationSelect(`${location.name}, ${location.area}`)}
                    className="flex items-center justify-between p-3 border border-orange-100 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-medium text-orange-800">{location.name}</div>
                      <div className="text-sm text-orange-600">{location.area}</div>
                    </div>
                    <Badge variant="outline" className="border-orange-200 text-orange-700">
                      {location.type}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
