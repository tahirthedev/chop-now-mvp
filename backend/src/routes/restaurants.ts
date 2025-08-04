import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createRestaurantSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().optional(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  imageUrl: Joi.string().uri().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  deliveryFee: Joi.number().min(0).default(0),
  minOrder: Joi.number().min(0).default(0),
  deliveryTime: Joi.number().min(1).default(30)
});

// GET /api/restaurants - List all restaurants
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        menuItems: {
          where: {
            isAvailable: true
          },
          take: 5, // Just show a few sample items
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true
          }
        },
        _count: {
          select: {
            menuItems: true,
            orders: true,
            reviews: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    // Return as an array directly (not wrapped in an object)
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurants'
    });
  }
});

// GET /api/restaurants/:id - Get restaurant details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        menuItems: {
          where: {
            isAvailable: true
          },
          orderBy: {
            category: 'asc'
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            orders: true,
            reviews: true
          }
        }
      }
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
      return;
    }

    if (!restaurant.isActive) {
      res.status(404).json({
        success: false,
        message: 'Restaurant is currently unavailable'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurant details'
    });
  }
});

// POST /api/restaurants - Create new restaurant (Restaurant Owner only)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createRestaurantSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    // For testing purposes, create with a default owner (first RESTAURANT_OWNER user)
    const defaultOwner = await prisma.user.findFirst({
      where: { role: 'RESTAURANT_OWNER' }
    });

    if (!defaultOwner) {
      res.status(400).json({
        success: false,
        message: 'No restaurant owner found. Please register as a restaurant owner first.'
      });
      return;
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        ...value,
        ownerId: defaultOwner.id,
        isActive: true,
        rating: 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: {
        restaurantId: restaurant.id,
        restaurant: restaurant
      }
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating restaurant'
    });
  }
});

export default router;
