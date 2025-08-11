'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { 
  UsersIcon, 
  BuildingStorefrontIcon,
  TruckIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  totalOrders: number;
  rating: number;
  joinedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'RIDER' | 'ADMIN';
  status: 'active' | 'inactive';
  joinedAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);

  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1234,
    totalRestaurants: 89,
    totalRiders: 45,
    totalOrders: 5678,
    monthlyRevenue: 125000,
    activeOrders: 23
  };

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Pizza Palace',
      email: 'contact@pizzapalace.com',
      phone: '+1234567890',
      address: '123 Main St, City',
      status: 'active',
      totalOrders: 234,
      rating: 4.5,
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Burger Barn',
      email: 'info@burgerbarn.com',
      phone: '+1234567891',
      address: '456 Oak Ave, City',
      status: 'active',
      totalOrders: 189,
      rating: 4.2,
      joinedAt: '2024-02-10'
    },
    {
      id: '3',
      name: 'Sushi Spot',
      email: 'hello@sushispot.com',
      phone: '+1234567892',
      address: '789 Pine St, City',
      status: 'pending',
      totalOrders: 0,
      rating: 0,
      joinedAt: '2024-08-01'
    }
  ];

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567893',
      role: 'CUSTOMER',
      status: 'active',
      joinedAt: '2024-03-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567894',
      role: 'RIDER',
      status: 'active',
      joinedAt: '2024-04-20'
    }
  ];

  const tabButtons = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'restaurants', name: 'Restaurants', icon: BuildingStorefrontIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="12% from last month"
          changeType="increase"
          icon={<UsersIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Restaurants"
          value={stats.totalRestaurants}
          change="3 new this month"
          changeType="increase"
          icon={<BuildingStorefrontIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Active Riders"
          value={stats.totalRiders}
          change="5 new this month"
          changeType="increase"
          icon={<TruckIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change="18% from last month"
          changeType="increase"
          icon={<ShoppingBagIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change="25% from last month"
          changeType="increase"
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={<ShoppingBagIcon className="h-6 w-6" />}
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              <li className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <PlusIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-500">
                        New restaurant <span className="font-medium text-gray-900">Sushi Spot</span> joined
                      </p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-500">
                        5 new customers registered today
                      </p>
                      <p className="text-xs text-gray-400">4 hours ago</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRestaurants = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Restaurant Management</h2>
        <button
          onClick={() => setShowAddRestaurant(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Restaurant
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BuildingStorefrontIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {restaurant.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          restaurant.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : restaurant.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {restaurant.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{restaurant.email}</p>
                      <p className="text-sm text-gray-500">{restaurant.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{restaurant.totalOrders} orders</p>
                      <p className="text-sm text-gray-500">★ {restaurant.rating}/5</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {user.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'CUSTOMER' 
                            ? 'bg-blue-100 text-blue-800'
                            : user.role === 'RIDER'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">Joined: {new Date(user.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Order management interface coming soon...</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute requiredRoles={['ADMIN']}>
      <DashboardLayout title="Admin Dashboard">
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
        {activeTab === 'restaurants' && renderRestaurants()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'orders' && renderOrders()}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
