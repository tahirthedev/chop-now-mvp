'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { 
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  TruckIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'picked_up' | 'delivered';
  createdAt: string;
  estimatedTime?: string;
}

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<string[]>([]);

  // Mock data - replace with actual API calls
  const stats = {
    todayOrders: 23,
    todayRevenue: 1250,
    avgOrderValue: 54.35,
    pendingOrders: 5,
    preparingOrders: 3,
    readyOrders: 2
  };

  const orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      items: ['Margherita Pizza', 'Caesar Salad', 'Coke'],
      total: 28.50,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedTime: '25 min'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      items: ['Pepperoni Pizza', 'Garlic Bread'],
      total: 22.00,
      status: 'preparing',
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      estimatedTime: '15 min'
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      items: ['Hawaiian Pizza', 'Wings', 'Sprite'],
      total: 35.75,
      status: 'ready',
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      estimatedTime: 'Ready'
    },
    {
      id: 'ORD-004',
      customerName: 'Sarah Wilson',
      items: ['Veggie Pizza', 'Greek Salad'],
      total: 24.25,
      status: 'picked_up',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      estimatedTime: 'Picked up'
    }
  ];

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const riderNotifications = [
        'Rider Alex is on the way to pick up Order #ORD-003',
        'Rider Sarah has arrived at your restaurant for Order #ORD-002',
        'Order #ORD-001 pickup scheduled in 10 minutes'
      ];
      
      const randomNotification = riderNotifications[Math.floor(Math.random() * riderNotifications.length)];
      setNotifications(prev => [randomNotification, ...prev.slice(0, 4)]);
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const tabButtons = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'menu', name: 'Menu', icon: ClockIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would call an API
    console.log(`Updating order ${orderId} to ${newStatus}`);
    
    // Add notification for rider updates
    if (newStatus === 'ready') {
      setNotifications(prev => [`Order ${orderId} is ready for pickup`, ...prev.slice(0, 4)]);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          change="15% from yesterday"
          changeType="increase"
          icon={<ShoppingBagIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${stats.todayRevenue}`}
          change="12% from yesterday"
          changeType="increase"
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Avg Order Value"
          value={`$${stats.avgOrderValue}`}
          change="3% from yesterday"
          changeType="increase"
          icon={<ChartBarIcon className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<ClockIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Preparing"
          value={stats.preparingOrders}
          icon={<ShoppingBagIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Ready for Pickup"
          value={stats.readyOrders}
          icon={<CheckCircleIcon className="h-6 w-6" />}
          color="green"
        />
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Rider Updates</h3>
        </div>
        <div className="p-6">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <TruckIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm text-blue-800">{notification}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent notifications</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
      
      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {orders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)).map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Order {order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Items:</p>
                    <ul className="text-sm text-gray-800">
                      {order.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">${order.total}</span>
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'picked_up')}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Mark Picked Up
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Completed Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {orders.filter(order => ['picked_up', 'delivered'].includes(order.status)).map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Order {order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">${order.total}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Menu management interface coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">Here you'll be able to add, edit, and manage your menu items, categories, and pricing.</p>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Rider Notifications</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Live Updates</h3>
          <p className="text-sm text-gray-500">Real-time notifications about rider pickups and deliveries</p>
        </div>
        <div className="p-6">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-800">{notification}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400">Rider updates will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute requiredRoles={['RESTAURANT_OWNER']}>
      <DashboardLayout title="Restaurant Dashboard">
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
                  {tab.id === 'notifications' && notifications.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'menu' && renderMenu()}
        {activeTab === 'notifications' && renderNotifications()}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
