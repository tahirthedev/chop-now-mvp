"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    // Create admin user
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@chopnow.com' },
        update: {},
        create: {
            email: 'admin@chopnow.com',
            password: hashedPassword,
            name: 'Admin User',
            phone: '+1234567890',
            role: client_1.Role.ADMIN,
        },
    });
    console.log('✅ Admin user created:', admin.email);
    // Create sample restaurant owner
    const restaurantOwnerPassword = await bcryptjs_1.default.hash('owner123', 12);
    const restaurantOwner = await prisma.user.upsert({
        where: { email: 'owner@restaurant.com' },
        update: {},
        create: {
            email: 'owner@restaurant.com',
            password: restaurantOwnerPassword,
            name: 'Restaurant Owner',
            phone: '+1234567891',
            role: client_1.Role.RESTAURANT_OWNER,
        },
    });
    console.log('✅ Restaurant owner created:', restaurantOwner.email);
    // Create sample restaurant
    const restaurant = await prisma.restaurant.upsert({
        where: { id: 'sample-restaurant-id' },
        update: {},
        create: {
            id: 'sample-restaurant-id',
            name: 'Delicious Bites',
            description: 'Your favorite local restaurant with amazing food',
            address: '123 Food Street, Taste City, TC 12345',
            phone: '+1234567892',
            imageUrl: 'https://via.placeholder.com/400x300',
            latitude: 40.7128,
            longitude: -74.0060,
            deliveryFee: 2.99,
            minOrder: 15.00,
            deliveryTime: 30,
            ownerId: restaurantOwner.id,
        },
    });
    console.log('✅ Sample restaurant created:', restaurant.name);
    // Create sample menu items
    const menuItems = [
        {
            name: 'Classic Burger',
            description: 'Juicy beef patty with fresh lettuce, tomato, and special sauce',
            price: 12.99,
            category: 'Burgers',
            restaurantId: restaurant.id,
        },
        {
            name: 'Margherita Pizza',
            description: 'Traditional pizza with fresh mozzarella and basil',
            price: 16.99,
            category: 'Pizza',
            restaurantId: restaurant.id,
        },
        {
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce with parmesan and croutons',
            price: 9.99,
            category: 'Salads',
            restaurantId: restaurant.id,
        },
    ];
    for (const item of menuItems) {
        await prisma.menuItem.create({
            data: item,
        });
    }
    console.log('✅ Sample menu items created');
    // Create sample customer
    const customerPassword = await bcryptjs_1.default.hash('customer123', 12);
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            password: customerPassword,
            name: 'John Customer',
            phone: '+1234567893',
            role: client_1.Role.CUSTOMER,
        },
    });
    console.log('✅ Sample customer created:', customer.email);
    // Create sample rider
    const riderPassword = await bcryptjs_1.default.hash('rider123', 12);
    const rider = await prisma.user.upsert({
        where: { email: 'rider@delivery.com' },
        update: {},
        create: {
            email: 'rider@delivery.com',
            password: riderPassword,
            name: 'Delivery Rider',
            phone: '+1234567894',
            role: client_1.Role.RIDER,
        },
    });
    console.log('✅ Sample rider created:', rider.email);
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample accounts created:');
    console.log('👤 Admin: admin@chopnow.com / admin123');
    console.log('🏪 Restaurant Owner: owner@restaurant.com / owner123');
    console.log('👥 Customer: customer@example.com / customer123');
    console.log('🚴 Rider: rider@delivery.com / rider123');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
