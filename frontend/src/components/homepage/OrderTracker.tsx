'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  restaurant: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'on_way' | 'delivered';
  estimatedDelivery: string;
  total: number;
  rider?: {
    name: string;
    phone: string;
    rating: number;
  };
  trackingUpdates: Array<{
    status: string;
    time: string;
    message: string;
  }>;
}

interface OrderTrackerProps {
  userId?: string;
}

export default function OrderTracker({ userId }: OrderTrackerProps) {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock data for active orders
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-2024-001',
        restaurant: {
          name: "Mama Afrika's Kitchen",
          phone: '+44 20 1234 5678',
          address: '123 Lagos Street, London'
        },
        items: [
          { name: 'Jollof Rice with Chicken', quantity: 1, price: 14.99 },
          { name: 'Suya Skewers', quantity: 2, price: 12.99 }
        ],
        status: 'on_way',
        estimatedDelivery: '7:45 PM',
        total: 40.97,
        rider: {
          name: 'David Smith',
          phone: '+44 20 9876 5432',
          rating: 4.8
        },
        trackingUpdates: [
          { status: 'confirmed', time: '7:10 PM', message: 'Order confirmed by restaurant' },
          { status: 'preparing', time: '7:15 PM', message: 'Kitchen started preparing your order' },
          { status: 'ready', time: '7:30 PM', message: 'Order ready for pickup' },
          { status: 'picked_up', time: '7:35 PM', message: 'Order picked up by rider' },
          { status: 'on_way', time: '7:38 PM', message: 'Rider is on the way to your location' }
        ]
      }
    ];
    
    setActiveOrders(mockOrders);
    if (mockOrders.length > 0) {
      setSelectedOrder(mockOrders[0]);
    }
  }, []);

  const getStatusProgress = (status: string) => {
    const statusMap = {
      'confirmed': 20,
      'preparing': 40,
      'ready': 60,
      'picked_up': 80,
      'on_way': 90,
      'delivered': 100
    };
    return statusMap[status as keyof typeof statusMap] || 0;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'ready': 'bg-purple-100 text-purple-800',
      'picked_up': 'bg-indigo-100 text-indigo-800',
      'on_way': 'bg-green-100 text-green-800',
      'delivered': 'bg-emerald-100 text-emerald-800'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'preparing':
        return <ClockIcon className="h-5 w-5" />;
      case 'ready':
      case 'picked_up':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'on_way':
        return <TruckIcon className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const formatStatus = (status: string) => {
    const statusMap = {
      'confirmed': 'Order Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready for Pickup',
      'picked_up': 'Picked Up',
      'on_way': 'On the Way',
      'delivered': 'Delivered'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (activeOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-orange-100">
          <CardContent className="p-12 text-center">
            <TruckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Orders</h3>
            <p className="text-gray-500 mb-6">You don't have any orders to track right now.</p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Browse Restaurants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-1">
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="text-lg text-orange-800">Active Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedOrder?.id === order.id
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200 hover:bg-orange-25'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.restaurant.name}</h4>
                      <p className="text-sm text-gray-600">#{order.id}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ETA: {order.estimatedDelivery}</span>
                    <span className="font-medium text-orange-600">£{order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-2">
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <Card className="border-orange-100">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-orange-800">
                      Order #{selectedOrder.id}
                    </CardTitle>
                    <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-2`}>
                      {getStatusIcon(selectedOrder.status)}
                      {formatStatus(selectedOrder.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Delivery Progress</span>
                      <span className="text-sm text-gray-600">ETA: {selectedOrder.estimatedDelivery}</span>
                    </div>
                    <Progress 
                      value={getStatusProgress(selectedOrder.status)} 
                      className="h-2 bg-orange-100"
                    />
                  </div>

                  {/* Restaurant Info */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">{selectedOrder.restaurant.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-orange-600">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{selectedOrder.restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{selectedOrder.restaurant.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rider Info */}
                  {selectedOrder.rider && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Your Delivery Rider</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-green-700">{selectedOrder.rider.name}</p>
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <span>⭐ {selectedOrder.rider.rating}</span>
                            <span>•</span>
                            <span>{selectedOrder.rider.phone}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                            <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border-orange-100">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                        </div>
                        <span className="text-orange-600">£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-orange-600">£{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card className="border-orange-100">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.trackingUpdates.map((update, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(update.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900">{update.message}</p>
                            <span className="text-sm text-gray-500">{update.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
