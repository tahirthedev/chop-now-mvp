# Phase 1: Project Setup & Database Foundation

I'm building a complete food delivery web application with 4 main components:
1. Customer Web App (browse restaurants, place orders, track delivery)
2. Restaurant Dashboard (manage menu, orders, analytics)  
3. Rider Dashboard (accept orders, navigation, earnings)
4. Admin Dashboard (system management, analytics, user management)

## Tech Stack Requirements:
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express.js and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and real-time data
- **Authentication**: JWT tokens

## What I Need Help With:

### 1. Complete Project Structure Setup
Create the exact folder structure and initialize both projects with all necessary dependencies.

### 2. Prisma Database Schema
I need a complete Prisma schema with these models and relationships:
- **User** (id, email, password, name, phone, role, isActive, timestamps)
- **Restaurant** (id, name, description, address, phone, imageUrl, coordinates, isActive, rating, deliveryFee, minOrder, deliveryTime, ownerId)
- **MenuItem** (id, name, description, price, imageUrl, category, isAvailable, restaurantId)
- **Order** (id, orderNumber, status, pricing fields, deliveryAddress, customerId, restaurantId)
- **OrderItem** (id, quantity, price, notes, orderId, menuItemId)
- **Delivery** (id, status, pickup/delivery times, rider coordinates, orderId, riderId)
- **Payment** (id, amount, status, paymentMethod, transactionId, orderId)
- **Review** (id, rating, comment, userId, restaurantId)

With enums for:
- Role: CUSTOMER, RESTAURANT_OWNER, RIDER, ADMIN
- OrderStatus: PENDING, CONFIRMED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
- DeliveryStatus: ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED
- PaymentStatus: PENDING, COMPLETED, FAILED, REFUNDED

### 3. Basic Express Server Setup
- TypeScript configuration
- Essential middleware (CORS, helmet, morgan, express.json)
- Error handling middleware
- Basic route structure
- Database connection setup
- Redis connection setup

### 4. Next.js Frontend Setup
- TypeScript and Tailwind CSS configured
- Basic folder structure for different user dashboards
- Essential dependencies installed

### 5. Environment Configuration
- Backend .env with database, Redis, JWT settings
- Frontend .env.local with API URL
- Docker compose file for PostgreSQL and Redis

### 6. Development Scripts
- Package.json scripts for development, build, database migrations
- Instructions for running the development environment

## Please Provide:

1. **Complete file contents** for every file you create (not just snippets)
2. **Step-by-step setup instructions** 
3. **All package.json files** with exact dependencies and versions
4. **Complete Prisma schema** with all relationships
5. **Docker compose configuration**
6. **Environment file templates**
7. **Instructions to verify everything works** (how to test the setup)

## Expected Outcome:
After following your instructions, I should have:
- Both projects running (`npm run dev` works for frontend and backend)
- Database connection established with all tables created
- Redis connection working
- TypeScript compiling without errors
- Basic "Hello World" API endpoint responding
- Next.js development server running

Please provide the complete setup in a logical order with all file contents and setup commands.