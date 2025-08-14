'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  UserCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  HeartIcon,
  ClockIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface UserProfileProps {
  user?: any;
  onClose?: () => void;
}

export default function UserProfile({ user: userProp, onClose }: UserProfileProps) {
  const { user: authUser, logout } = useAuth();
  const user = userProp || authUser;
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data for user profile
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+44 20 1234 5678',
    avatar: '/api/placeholder/100/100'
  });

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      address: '123 Brixton Road, London SW9 6DE',
      isDefault: true
    },
    {
      id: '2',
      type: 'Work',
      address: '456 Camden High Street, London NW1 7JH',
      isDefault: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      lastFour: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'Mastercard',
      lastFour: '8888',
      expiryDate: '08/26',
      isDefault: false
    }
  ]);

  const recentOrders = [
    {
      id: '1',
      restaurant: "Mama Afrika's Kitchen",
      items: 'Jollof Rice, Suya Skewers',
      total: 28.50,
      date: '2024-01-15',
      status: 'Delivered'
    },
    {
      id: '2',
      restaurant: 'Ethiopian Delights',
      items: 'Doro Wat, Injera',
      total: 22.99,
      date: '2024-01-12',
      status: 'Delivered'
    }
  ];

  const favoriteRestaurants = [
    {
      id: '1',
      name: "Mama Afrika's Kitchen",
      cuisine: 'Nigerian',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Accra Gold Restaurant',
      cuisine: 'Ghanaian', 
      rating: 4.7
    }
  ];

  const profileSections = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'payment', label: 'Payment', icon: CreditCardIcon },
    { id: 'orders', label: 'Order History', icon: ClockIcon },
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  const handleSaveProfile = () => {
    // Here you would typically make an API call to save the profile
    setIsEditing(false);
  };

  const renderProfileSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-orange-600" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="font-semibold text-lg"
                    />
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
                    <p className="text-gray-600">{profileData.email}</p>
                    <p className="text-gray-600">{profileData.phone}</p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-orange-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">24</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </CardContent>
              </Card>
              <Card className="border-orange-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">£420.50</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </CardContent>
              </Card>
              <Card className="border-orange-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <div className="text-sm text-gray-600">Favorite Restaurants</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Delivery Addresses</h3>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
            
            {addresses.map((address) => (
              <Card key={address.id} className="border-orange-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={address.isDefault ? "default" : "secondary"}>
                          {address.type}
                        </Badge>
                        {address.isDefault && (
                          <Badge className="bg-green-100 text-green-800">Default</Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{address.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>
            
            {paymentMethods.map((method) => (
              <Card key={method.id} className="border-orange-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-8 w-8 text-orange-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.type} •••• {method.lastFour}</span>
                          {method.isDefault && (
                            <Badge className="bg-green-100 text-green-800">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            {recentOrders.map((order) => (
              <Card key={order.id} className="border-orange-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{order.restaurant}</h4>
                        <Badge className={
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{order.items}</p>
                      <p className="text-gray-500 text-sm">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">£{order.total.toFixed(2)}</p>
                      <Button variant="ghost" size="sm" className="text-orange-600">
                        Reorder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Favorite Restaurants</h3>
            {favoriteRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="border-orange-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{restaurant.name}</h4>
                      <p className="text-gray-600 text-sm">{restaurant.cuisine} Cuisine</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Badge className="bg-orange-100 text-orange-800">
                          ⭐ {restaurant.rating}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <HeartIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Settings</h3>
            
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-orange-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Order updates</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Promotional emails</span>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex justify-between items-center">
                  <span>New restaurant alerts</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 text-orange-600" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-orange-100">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {profileSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full justify-start ${
                        activeSection === section.id
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {section.label}
                    </Button>
                  );
                })}
                
                <Separator className="my-4" />
                
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Sign Out
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="border-orange-100">
            <CardContent className="p-6">
              {renderProfileSection()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
