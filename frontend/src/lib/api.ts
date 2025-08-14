// Restaurant API types and functions

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  minOrder?: number; // alias for minimumOrder
  image: string;
  imageUrl?: string; // alias for image
  distance: number;
  isOpen: boolean;
  isFavorite: boolean;
  tags: string[];
  address: string;
  description: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  reviewCount?: number;
  sampleMenuItems?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Mock API for restaurants
export const restaurantApi = {
  async getRestaurants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: any;
  }): Promise<PaginatedResponse<Restaurant>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: "Mama Afrika's Kitchen",
        cuisine: 'Nigerian',
        rating: 4.8,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        minimumOrder: 15.00,
        image: 'http://localhost:5000/api/food/nigerian?width=300&height=200',
        distance: 0.8,
        isOpen: true,
        isFavorite: false,
        tags: ['Halal', 'Vegetarian Options', 'Popular'],
        address: '123 Lagos Street, Peckham',
        description: 'Authentic West African cuisine with traditional jollof rice and grilled meats'
      },
      {
        id: '2',
        name: 'Ethiopian Delights',
        cuisine: 'Ethiopian',
        rating: 4.6,
        deliveryTime: '30-40 min',
        deliveryFee: 3.49,
        minimumOrder: 20.00,
        image: 'http://localhost:5000/api/food/ethiopian?width=300&height=200',
        distance: 1.2,
        isOpen: true,
        isFavorite: false,
        tags: ['Vegan Friendly', 'Spicy', 'Traditional'],
        address: '456 Addis Road, Brixton',
        description: 'Traditional Ethiopian dishes served with injera bread and authentic spice blends'
      },
      {
        id: '3',
        name: 'Cape Town Corner',
        cuisine: 'South African',
        rating: 4.7,
        deliveryTime: '20-30 min',
        deliveryFee: 2.49,
        minimumOrder: 12.00,
        image: 'http://localhost:5000/api/food/south-african?width=300&height=200',
        distance: 0.5,
        isOpen: true,
        isFavorite: false,
        tags: ['Braai', 'Comfort Food', 'Family Owned'],
        address: '789 Cape Street, Elephant & Castle',
        description: 'South African braai and comfort food bringing the taste of the Rainbow Nation'
      },
      {
        id: '4',
        name: 'Nile Valley Restaurant',
        cuisine: 'Moroccan',
        rating: 4.5,
        deliveryTime: '35-45 min',
        deliveryFee: 3.99,
        minimumOrder: 18.00,
        image: 'http://localhost:5000/api/food/moroccan?width=300&height=200',
        distance: 1.8,
        isOpen: false,
        isFavorite: false,
        tags: ['Mediterranean', 'Halal', 'Fresh'],
        address: '321 Nile Avenue, Dalston',
        description: 'Fresh North African and Mediterranean dishes with aromatic herbs and spices'
      },
      {
        id: '5',
        name: 'Lagos Lounge',
        cuisine: 'Nigerian',
        rating: 4.9,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        minimumOrder: 16.00,
        image: 'http://localhost:5000/api/food/nigerian?width=300&height=200',
        distance: 1.0,
        isOpen: true,
        isFavorite: false,
        tags: ['Suya', 'Jollof', 'Popular', 'Late Night'],
        address: '654 Victoria Island Road, Tottenham',
        description: 'Premium Nigerian cuisine featuring the best suya and jollof rice in London'
      },
      {
        id: '6',
        name: 'Zanzibar Spice House',
        cuisine: 'Kenyan',
        rating: 4.4,
        deliveryTime: '30-40 min',
        deliveryFee: 3.29,
        minimumOrder: 17.00,
        image: 'http://localhost:5000/api/food/kenyan?width=300&height=200',
        distance: 1.5,
        isOpen: true,
        isFavorite: false,
        tags: ['Swahili', 'Seafood', 'Coconut'],
        address: '987 Spice Route, Southwark',
        description: 'East African coastal cuisine with fresh seafood and aromatic coconut curries'
      }
    ];

    return {
      data: mockRestaurants,
      total: mockRestaurants.length,
      page: params?.page || 1,
      limit: params?.limit || 10
    };
  }
};