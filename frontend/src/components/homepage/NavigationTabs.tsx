'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  ClockIcon, 
  UserIcon,
  HeartIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  orderCount?: number;
}

export default function NavigationTabs({ activeTab, onTabChange, orderCount }: NavigationTabsProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingCartIcon, badge: orderCount || 0 },
    { id: 'tracking', label: 'Track Order', icon: ClockIcon },
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
    { id: 'payment', label: 'Payment', icon: CreditCardIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon }
  ];

  return (
    <div className="bg-white border-b border-orange-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-600">
              ChopNow
            </h1>
            <span className="ml-2 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              🌍 African Cuisine
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.badge && (
                    <Badge className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-orange-600 hover:bg-orange-50"
              onClick={() => onTabChange('profile')}
            >
              <UserIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-orange-100">
          <div className="grid grid-cols-3 gap-1 p-2">
            {tabs.slice(0, 6).map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                  {tab.badge && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
