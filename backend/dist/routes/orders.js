"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const createOrderSchema = joi_1.default.object({
    restaurantId: joi_1.default.string().required(),
    customerId: joi_1.default.string().required(),
    items: joi_1.default.array().items(joi_1.default.object({
        menuItemId: joi_1.default.string().required(),
        quantity: joi_1.default.number().min(1).required()
    })).min(1).required(),
    deliveryAddress: joi_1.default.string().required(),
    deliveryNotes: joi_1.default.string().optional()
});
const updateOrderStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED').required()
});
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        address: true
                    }
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                orderItems: {
                    include: {
                        menuItem: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            data: orders
        });
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching orders'
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const { error, value } = createOrderSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
            return;
        }
        const { restaurantId, customerId, items, deliveryAddress, deliveryNotes } = value;
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
        const customer = await prisma.user.findUnique({
            where: { id: customerId }
        });
        if (!customer) {
            res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
            return;
        }
        let subtotal = 0;
        for (const item of items) {
            const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId }
            });
            if (menuItem) {
                subtotal += menuItem.price * item.quantity;
            }
        }
        const deliveryFee = restaurant.deliveryFee;
        const tax = subtotal * 0.1;
        const total = subtotal + deliveryFee + tax;
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const order = await prisma.order.create({
            data: {
                orderNumber,
                restaurantId,
                customerId,
                subtotal,
                deliveryFee,
                tax,
                total,
                deliveryAddress,
                deliveryNotes: deliveryNotes,
                status: 'PENDING',
                orderItems: {
                    create: items.map((item) => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        price: 0
                    }))
                }
            },
            include: {
                orderItems: {
                    include: {
                        menuItem: true
                    }
                }
            }
        });
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: order.id,
                order: order
            }
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating order'
        });
    }
});
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = updateOrderStatusSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
            return;
        }
        const { status } = value;
        const order = await prisma.order.findUnique({
            where: { id }
        });
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                restaurant: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                customer: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: updatedOrder
        });
    }
    catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating order status'
        });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map