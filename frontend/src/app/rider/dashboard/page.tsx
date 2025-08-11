'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { 
  TruckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface Delivery {
  id: string;
  orderId: string;
  restaurant: {
    name: string;
    address: string;
    phone: string;
  };
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  total: number;
  estimatedTime: string;
  distance: string;
  earnings: number;
  createdAt: string;
}

export default function RiderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('Downtown Area');

  // Mock data - replace with actual API calls
  const stats = {
    todayEarnings: 125.50,
    completedDeliveries: 8,
    avgDeliveryTime: 28,
    rating: 4.8,
    hoursWorked: 6.5,
    pendingDeliveries: 2
  };

  const deliveries: Delivery[] = [
    {
      id: 'DEL-001',
      orderId: 'ORD-123',
      restaurant: {
        name: 'Pizza Palace',
        address: '123 Main St, Downtown',
        phone: '(555) 123-4567'
      },
      customer: {
        name: 'John Doe',
        address: '456 Oak Ave, Apt 2B',
        phone: '(555) 987-6543'
      },
      status: 'assigned',
      total: 28.50,
      estimatedTime: '25 min',
      distance: '2.1 km',
      earnings: 5.50,
      createdAt: new Date().toISOString()
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-124',
      restaurant: {
        name: 'Burger Hub',
        address: '789 Elm St, Midtown',
        phone: '(555) 234-5678'
      },
      customer: {
        name: 'Jane Smith',
        address: '321 Pine Rd, Building A',
        phone: '(555) 876-5432'
      },
      status: 'picked_up',
      total: 22.00,
      estimatedTime: '15 min',
      distance: '1.8 km',
      earnings: 4.50,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: 'DEL-003',
      orderId: 'ORD-125',
      restaurant: {
        name: 'Sushi Express',
        address: '555 River Dr, Eastside',
        phone: '(555) 345-6789'
      },
      customer: {
        name: 'Mike Johnson',
        address: '987 Cedar Lane, Unit 5',
        phone: '(555) 765-4321'
      },
      status: 'delivered',
      total: 45.75,
      estimatedTime: 'Completed',
      distance: '3.2 km',
      earnings: 8.50,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ];

  const tabButtons = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'deliveries', name: 'Deliveries', icon: TruckIcon },
    { id: 'earnings', name: 'Earnings', icon: CurrencyDollarIcon },
    { id: 'profile', name: 'Profile', icon: MapPinIcon }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    // In a real app, this would call an API
    console.log(`Updating delivery ${deliveryId} to ${newStatus}`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Online Status Toggle */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Status</h3>
            <p className="text-sm text-gray-600">Toggle your availability for new deliveries</p>
          </div>
          <div className="flex items-center">
            <span className={`mr-3 text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isOnline ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isOnline ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-1" />
          Current location: {currentLocation}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Today's Earnings"
          value={`$${stats.todayEarnings}`}
          change="8% from yesterday"
          changeType="increase"
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Completed Deliveries"
          value={stats.completedDeliveries}
          change="5% from yesterday"
          changeType="increase"
          icon={<CheckCircleIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Avg Delivery Time"
          value={`${stats.avgDeliveryTime} min`}
          change="2 min faster"
          changeType="increase"
          icon={<ClockIcon className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Rating"
          value={stats.rating}
          icon={<ChartBarIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Hours Worked"
          value={`${stats.hoursWorked}h`}
          icon={<ClockIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={<TruckIcon className="h-6 w-6" />}
          color="orange"
        />
      </div>
    </div>
  );

  const renderDeliveries = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Delivery Management</h2>
      
      {/* Active Deliveries */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Deliveries</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {deliveries.filter(delivery => ['assigned', 'picked_up', 'in_transit'].includes(delivery.status)).map((delivery) => (
              <div key={delivery.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-gray-900">Delivery {delivery.id}</p>
                    <p className="text-sm text-gray-600">Order: {delivery.orderId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                    {delivery.status.replace('_', ' ')}
                  </span>
                </div>
                
                {/* Restaurant Info */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Pickup from:</h4>
                  <p className="text-sm text-gray-800">{delivery.restaurant.name}</p>
                  <p className="text-sm text-gray-600">{delivery.restaurant.address}</p>
                  <div className="mt-2 flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{delivery.restaurant.phone}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Deliver to:</h4>
                  <p className="text-sm text-gray-800">{delivery.customer.name}</p>
                  <p className="text-sm text-gray-600">{delivery.customer.address}</p>
                  <div className="mt-2 flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{delivery.customer.phone}</span>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Total</p>
                    <p className="font-medium text-gray-900">${delivery.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Your Earnings</p>
                    <p className="font-medium text-green-600">${delivery.earnings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-medium text-gray-900">{delivery.distance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Est. Time</p>
                    <p className="font-medium text-gray-900">{delivery.estimatedTime}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {delivery.status === 'assigned' && (
                    <>
                      <button
                        onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        Mark Picked Up
                      </button>
                      <button className="border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded text-sm font-medium">
                        Decline
                      </button>
                    </>
                  )}
                  {delivery.status === 'picked_up' && (
                    <button
                      onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                      Mark Delivered
                    </button>
                  )}
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium">
                    Get Directions
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium">
                    Call Customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Completed Deliveries */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Completed Deliveries</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {deliveries.filter(delivery => delivery.status === 'delivered').map((delivery) => (
              <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{delivery.restaurant.name} → {delivery.customer.name}</p>
                    <p className="text-sm text-gray-600">{delivery.distance} • ${delivery.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+${delivery.earnings}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(delivery.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Earnings Overview</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatCard
          title="Today's Earnings"
          value={`$${stats.todayEarnings}`}
          change="8% from yesterday"
          changeType="increase"
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="This Week"
          value="$847.25"
          change="12% from last week"
          changeType="increase"
          icon={<ChartBarIcon className="h-6 w-6" />}
          color="blue"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600">Base delivery fees</span>
            <span className="font-medium">$98.50</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600">Tips</span>
            <span className="font-medium">$27.00</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600">Bonuses</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex justify-between items-center py-3 font-semibold text-lg">
            <span>Total Today</span>
            <span className="text-green-600">${stats.todayEarnings}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Rider Profile</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Profile management interface coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">Here you'll be able to update your personal information, vehicle details, and preferences.</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute requiredRoles={['RIDER']}>
      <DashboardLayout title="Rider Dashboard">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabButtons.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'deliveries' && renderDeliveries()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'profile' && renderProfile()}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
