import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createMenuItemSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  imageUrl: Joi.string().uri().optional(),
  isAvailable: Joi.boolean().default(true),
  restaurantId: Joi.string().required()
});

// GET /api/menu/:restaurantId - Get menu items for a restaurant
router.get('/:restaurantId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;

    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
      return;
    }

    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: restaurantId,
        isAvailable: true
      },
      orderBy: {
        category: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu items'
    });
  }
});

// POST /api/menu - Create new menu item
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createMenuItemSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: value.restaurantId }
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
      return;
    }

    const menuItem = await prisma.menuItem.create({
      data: value
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: {
        menuItemId: menuItem.id,
        restaurantId: menuItem.restaurantId,
        menuItem: menuItem
      }
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating menu item'
    });
  }
});

export default router;
