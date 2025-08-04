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
const createMenuItemSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).required(),
    description: joi_1.default.string().optional(),
    price: joi_1.default.number().min(0).required(),
    category: joi_1.default.string().required(),
    imageUrl: joi_1.default.string().uri().optional(),
    isAvailable: joi_1.default.boolean().default(true),
    restaurantId: joi_1.default.string().required()
});
router.get('/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;
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
    }
    catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching menu items'
        });
    }
});
router.post('/', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating menu item'
        });
    }
});
exports.default = router;
//# sourceMappingURL=menu.js.map