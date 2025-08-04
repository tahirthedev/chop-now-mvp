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
const createRestaurantSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).required(),
    description: joi_1.default.string().optional(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    imageUrl: joi_1.default.string().uri().optional(),
    latitude: joi_1.default.number().optional(),
    longitude: joi_1.default.number().optional(),
    deliveryFee: joi_1.default.number().min(0).default(0),
    minOrder: joi_1.default.number().min(0).default(0),
    deliveryTime: joi_1.default.number().min(1).default(30)
});
router.get('/', async (req, res) => {
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
                    take: 5,
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
        res.status(200).json(restaurants);
    }
    catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching restaurants'
        });
    }
});
router.get('/:id', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching restaurant details:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching restaurant details'
        });
    }
});
router.post('/', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating restaurant'
        });
    }
});
exports.default = router;
//# sourceMappingURL=restaurants.js.map