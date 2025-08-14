import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import Joi from 'joi';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createOrderSchema = Joi.object({
  restaurantId: Joi.string().uuid().required(),
  deliveryAddress: Joi.string().min(5).max(200).required(),
  deliveryNotes: Joi.string().max(500).optional(),
  items: Joi.array().items(
    Joi.object({
      menuItemId: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
      notes: Joi.string().max(200).optional()
    })
  ).min(1).required()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(
    'PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 
    'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
  ).required(),
  estimatedDeliveryTime: Joi.date().optional()
});

// Helper function to generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CHN${timestamp.slice(-6)}${random}`;
}

// Helper function to calculate order totals
async function calculateOrderTotals(items: any[], restaurantId: string) {
  let subtotal = 0;
  
  for (const item of items) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: item.menuItemId }
    });
    
    if (!menuItem) {
      throw new Error(`Menu item ${item.menuItemId} not found`);
    }
    
    if (menuItem.restaurantId !== restaurantId) {
      throw new Error('All items must be from the same restaurant');
    }
    
    if (!menuItem.isAvailable) {
      throw new Error(`${menuItem.name} is currently unavailable`);
    }
    
    subtotal += menuItem.price * item.quantity;
  }
  
  // Get restaurant delivery fee
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId }
  });
  
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  
  if (subtotal < restaurant.minOrder) {
    throw new Error(`Minimum order amount is $${restaurant.minOrder}`);
  }
  
  const deliveryFee = restaurant.deliveryFee;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  
  return {
    subtotal,
    deliveryFee,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

// GET /api/orders - List orders (filtered by user role)
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const { 
      status, 
      restaurantId, 
      customerId, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc' 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause based on user role
    let whereClause: any = {};

    if (userRole === 'CUSTOMER') {
      whereClause.customerId = userId;
    } else if (userRole === 'RESTAURANT_OWNER') {
      // Get user's restaurant
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: userId }
      });
      
      if (restaurant) {
        whereClause.restaurantId = restaurant.id;
      } else {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
      }
    } else if (userRole === 'RIDER') {
      whereClause.delivery = {
        riderId: userId
      };
    }
    // ADMIN can see all orders (no additional filter)

    // Add additional filters
    if (status) {
      whereClause.status = status;
    }
    
    if (restaurantId && userRole === 'ADMIN') {
      whereClause.restaurantId = restaurantId;
    }
    
    if (customerId && userRole === 'ADMIN') {
      whereClause.customerId = customerId;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            imageUrl: true
          }
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                category: true
              }
            }
          }
        },
        delivery: {
          include: {
            rider: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        },
        payment: true
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      skip,
      take: Number(limit)
    });

    const total = await prisma.order.count({ where: whereClause });

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            imageUrl: true,
            deliveryTime: true
          }
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                category: true,
                preparationTime: true
              }
            }
          }
        },
        delivery: {
          include: {
            rider: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        },
        payment: true
      }
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Check permissions
    let hasAccess = false;
    if (userRole === 'ADMIN') {
      hasAccess = true;
    } else if (userRole === 'CUSTOMER' && order.customerId === userId) {
      hasAccess = true;
    } else if (userRole === 'RESTAURANT_OWNER') {
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: userId }
      });
      hasAccess = restaurant?.id === order.restaurantId;
    } else if (userRole === 'RIDER' && order.delivery?.riderId === userId) {
      hasAccess = true;
    }

    if (!hasAccess) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders - Create new order
router.post('/', authenticateToken, requireRole(['CUSTOMER']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const userId = (req as any).user.userId;
    const { restaurantId, deliveryAddress, deliveryNotes, items } = value;

    // Check if restaurant exists and is active
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant || !restaurant.isActive || !restaurant.isOpen) {
      res.status(400).json({ error: 'Restaurant is currently unavailable' });
      return;
    }

    // Calculate totals
    const totals = await calculateOrderTotals(items, restaurantId);

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: userId,
          restaurantId,
          deliveryAddress,
          deliveryNotes,
          subtotal: totals.subtotal,
          deliveryFee: totals.deliveryFee,
          tax: totals.tax,
          total: totals.total,
          estimatedDeliveryTime: new Date(Date.now() + restaurant.deliveryTime * 60000)
        }
      });

      // Create order items
      for (const item of items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId }
        });

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: menuItem!.price,
            notes: item.notes
          }
        });
      }

      // Create delivery record
      await tx.delivery.create({
        data: {
          orderId: newOrder.id
        }
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: totals.total,
          paymentMethod: 'pending' // Will be updated when payment is processed
        }
      });

      return newOrder;
    });

    // Fetch complete order data
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        },
        delivery: true,
        payment: true
      }
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`restaurant-${restaurantId}`).emit('newOrder', completeOrder);

    res.status(201).json(completeOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const { error, value } = updateOrderStatusSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { status, estimatedDeliveryTime } = value;

    // Get order and check permissions
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: true,
        delivery: true
      }
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Check permissions based on status and role
    let hasPermission = false;
    if (userRole === 'ADMIN') {
      hasPermission = true;
    } else if (userRole === 'RESTAURANT_OWNER') {
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: userId }
      });
      hasPermission = restaurant?.id === order.restaurantId;
      
      // Restaurant can only update certain statuses
      if (!['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'CANCELLED'].includes(status)) {
        hasPermission = false;
      }
    } else if (userRole === 'RIDER' && order.delivery?.riderId === userId) {
      // Rider can only update delivery-related statuses
      hasPermission = ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
    }

    if (!hasPermission) {
      res.status(403).json({ error: 'Permission denied for this status update' });
      return;
    }

    // Update order
    const updateData: any = { status };
    if (estimatedDeliveryTime) {
      updateData.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true
          }
        },
        delivery: {
          include: {
            rider: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Update delivery status if order status is delivery-related
    if (status === 'OUT_FOR_DELIVERY') {
      await prisma.delivery.update({
        where: { orderId: id },
        data: { 
          status: 'IN_TRANSIT',
          pickupTime: new Date()
        }
      });
    } else if (status === 'DELIVERED') {
      await prisma.delivery.update({
        where: { orderId: id },
        data: { 
          status: 'DELIVERED',
          deliveryTime: new Date()
        }
      });
    }

    // Emit real-time updates
    const io = req.app.get('io');
    io.to(`order-${id}`).emit('orderStatusUpdate', {
      orderId: id,
      status,
      updatedAt: new Date()
    });

    if (order.delivery?.riderId) {
      io.to(`rider-${order.delivery.riderId}`).emit('orderUpdate', updatedOrder);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// DELETE /api/orders/:id - Cancel order
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: true
      }
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Check permissions
    let canCancel = false;
    if (userRole === 'ADMIN') {
      canCancel = true;
    } else if (userRole === 'CUSTOMER' && order.customerId === userId) {
      // Customer can cancel only if order is not being prepared
      canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
    } else if (userRole === 'RESTAURANT_OWNER') {
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: userId }
      });
      canCancel = restaurant?.id === order.restaurantId;
    }

    if (!canCancel) {
      res.status(403).json({ error: 'Cannot cancel this order' });
      return;
    }

    // Update order status to cancelled
    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // Update payment status if exists
    await prisma.payment.updateMany({
      where: { orderId: id },
      data: { status: 'REFUNDED' }
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order-${id}`).emit('orderCancelled', {
      orderId: id,
      cancelledAt: new Date()
    });

    res.json({ message: 'Order cancelled successfully', order: cancelledOrder });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
