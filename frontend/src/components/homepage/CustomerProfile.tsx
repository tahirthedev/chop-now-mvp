'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  ClockIcon,
  HeartIcon,
  CogIcon,
  ShoppingBagIcon,
  TruckIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface CustomerProfileProps {
  onClose?: () => void;
}

interface OrderHistory {
  id: string;
  restaurant: string;
  items: string[];
  total: number;
  date: string;
  status: 'completed' | 'cancelled';
  rating?: number;
}

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  email?: string;
  isDefault: boolean;
}

export default function CustomerProfile({ onClose }: CustomerProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    preferences: {
      dietaryRestrictions: [] as string[],
      favoritesCuisines: [] as string[],
      allergies: [] as string[]
    }
  });

  const [orderHistory] = useState<OrderHistory[]>([
    {
      id: 'ORD-001',
      restaurant: "Mama Afrika's Kitchen",
      items: ['Jollof Rice with Chicken', 'Suya Skewers'],
      total: 42.50,
      date: '2024-01-15',
      status: 'completed',
      rating: 5
    },
    {
      id: 'ORD-002',
      restaurant: 'Ethiopian Delights',
      items: ['Injera with Doro Wot', 'Kitfo'],
      total: 38.75,
      date: '2024-01-10',
      status: 'completed',
      rating: 4
    },
    {
      id: 'ORD-003',
      restaurant: 'Cape Town Corner',
      items: ['Boerewors Roll', 'Biltong Platter'],
      total: 28.99,
      date: '2024-01-05',
      status: 'completed'
    }
  ]);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: '1',
      label: 'Home',
      address: '123 Main Street, London SE1 2AB',
      isDefault: true
    },
    {
      id: '2',
      label: 'Work',
      address: '456 Business Ave, London EC1 3CD',
      isDefault: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4321',
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ]);

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'
  ];

  const cuisineOptions = [
    'West African', 'East African', 'North African', 'Ethiopian', 'Nigerian', 'South African'
  ];

  const allergyOptions = [
    'Nuts', 'Dairy', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat', 'Sesame'
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // In a real app, you would call an API to update the profile
      console.log('Saving profile:', profileData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (category: keyof typeof profileData.preferences, item: string) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: prev.preferences[category].includes(item)
          ? prev.preferences[category].filter(i => i !== item)
          : [...prev.preferences[category], item]
      }
    }));
  };

  const addAddress = () => {
    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      label: 'New Address',
      address: '',
      isDefault: false
    };
    setSavedAddresses([...savedAddresses, newAddress]);
  };

  const removeAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses(savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-800">My Profile</h1>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            ✕ Close
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBagIcon className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <HeartIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-orange-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-orange-800">Personal Information</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-orange-200"
                >
                  <CogIcon className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className="border-orange-200"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className="border-orange-200"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="border-orange-200"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className="border-orange-200"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!isEditing}
                    className="border-orange-200"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card className="border-orange-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-orange-800">Saved Addresses</CardTitle>
                <Button
                  onClick={addAddress}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  + Add Address
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedAddresses.map((address) => (
                <div key={address.id} className="p-4 border border-orange-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{address.label}</h4>
                        {address.isDefault && (
                          <Badge className="bg-orange-100 text-orange-800">Default</Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{address.address}</p>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDefaultAddress(address.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeAddress(address.id)}
                        className="text-red-600 border-red-200"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card className="border-orange-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-orange-800">Payment Methods</CardTitle>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  + Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-4 border border-orange-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded">
                        <CreditCardIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {method.type === 'card' 
                            ? `Card ending in ${method.last4}` 
                            : `PayPal (${method.email})`
                          }
                        </h4>
                        {method.isDefault && (
                          <Badge className="bg-orange-100 text-orange-800 mt-1">Default</Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="text-orange-800">Order History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderHistory.map((order) => (
                <div key={order.id} className="p-4 border border-orange-100 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{order.restaurant}</h4>
                      <p className="text-sm text-gray-600">Order #{order.id} • {order.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="font-bold text-orange-600 mt-1">£{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-700">• {item}</p>
                    ))}
                  </div>

                  {order.rating && (
                    <div className="flex items-center gap-1 mt-3">
                      <span className="text-sm text-gray-600">Your rating:</span>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">Reorder</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                    {order.status === 'completed' && !order.rating && (
                      <Button size="sm" variant="outline">Rate Order</Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            {/* Dietary Restrictions */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="text-orange-800">Dietary Restrictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={profileData.preferences.dietaryRestrictions.includes(option) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        profileData.preferences.dietaryRestrictions.includes(option)
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'border-orange-200 hover:bg-orange-50'
                      }`}
                      onClick={() => togglePreference('dietaryRestrictions', option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorite Cuisines */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="text-orange-800">Favorite Cuisines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={profileData.preferences.favoritesCuisines.includes(option) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        profileData.preferences.favoritesCuisines.includes(option)
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'border-orange-200 hover:bg-orange-50'
                      }`}
                      onClick={() => togglePreference('favoritesCuisines', option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="text-orange-800">Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allergyOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={profileData.preferences.allergies.includes(option) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        profileData.preferences.allergies.includes(option)
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'border-red-200 hover:bg-red-50'
                      }`}
                      onClick={() => togglePreference('allergies', option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
