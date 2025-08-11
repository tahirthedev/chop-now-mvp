import { Order } from '@/types/dashboard';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  TruckIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline';

interface OrderTrackerProps {
  order: Order;
  showActions?: boolean;
  onStatusUpdate?: (orderId: string, status: Order['status']) => void;
}

export default function OrderTracker({ order, showActions = false, onStatusUpdate }: OrderTrackerProps) {
  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: ClockIcon },
    { key: 'preparing', label: 'Preparing', icon: ClockIcon },
    { key: 'ready', label: 'Ready', icon: CheckCircleIcon },
    { key: 'picked_up', label: 'Picked Up', icon: TruckIcon },
    { key: 'delivered', label: 'Delivered', icon: MapPinIcon }
  ];

  const getStepStatus = (stepKey: string) => {
    const currentIndex = statusSteps.findIndex(s => s.key === order.status);
    const stepIndex = statusSteps.findIndex(s => s.key === stepKey);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step.key);
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStepStyle(status)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`ml-2 text-sm ${
                status === 'current' ? 'font-medium text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < statusSteps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Customer</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-gray-600">Total</p>
            <p className="font-medium">${order.total}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Items</p>
            <ul className="text-gray-800">
              {order.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          {order.deliveryAddress && (
            <div className="col-span-2">
              <p className="text-gray-600">Delivery Address</p>
              <p className="text-gray-800">{order.deliveryAddress}</p>
            </div>
          )}
        </div>
      </div>

      {showActions && onStatusUpdate && (
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'preparing')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'ready')}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'picked_up')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
            >
              Mark Picked Up
            </button>
          )}
        </div>
      )}
    </div>
  );
}
