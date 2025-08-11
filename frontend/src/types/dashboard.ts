interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'picked_up' | 'delivered';
  createdAt: string;
  deliveryAddress?: string;
  estimatedTime?: string;
}

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

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  restaurantName: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  total: number;
  fee: number;
  estimatedTime: string;
  distance: string;
}

interface DailyEarnings {
  date: string;
  orders: number;
  earnings: number;
  tips: number;
  total: number;
}

export type { Order, Restaurant, User, Delivery, DailyEarnings };
