# ChopNow - Food Delivery Application

A complete food delivery web application with customer, restaurant, rider, and admin dashboards.

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with TypeScript & Tailwind CSS
- **Backend**: Node.js with Express.js & TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and real-time data
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO for live updates

## 📁 Project Structure

```
chop-now/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding
│   └── package.json
├── frontend/                # Next.js React application
│   ├── src/
│   │   ├── app/             # Next.js 14 app directory
│   │   │   ├── (customer)/  # Customer dashboard
│   │   │   ├── (restaurant)/ # Restaurant dashboard
│   │   │   ├── (rider)/     # Rider dashboard
│   │   │   └── (admin)/     # Admin dashboard
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities and configurations
│   │   └── types/           # TypeScript types
│   └── package.json
└── docker-compose.yml       # Database services
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for databases)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd chop-now
```

### 2. Start Database Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials:
# DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/chop_now_db?schema=public"

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Update .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Core Models

- **User**: Customer, Restaurant Owner, Rider, Admin accounts
- **Restaurant**: Restaurant information and settings
- **MenuItem**: Menu items for each restaurant
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within an order
- **Delivery**: Delivery tracking and rider assignment
- **Payment**: Payment processing and status
- **Review**: Customer reviews for restaurants

### Sample Data

After running `npm run db:seed`, you'll have these test accounts:

- **Admin**: `admin@chopnow.com` / `admin123`
- **Restaurant Owner**: `owner@restaurant.com` / `owner123`
- **Customer**: `customer@example.com` / `customer123`
- **Rider**: `rider@delivery.com` / `rider123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Restaurants
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (Owner)
- `PUT /api/restaurants/:id` - Update restaurant (Owner)

### Menu
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `POST /api/menu` - Add menu item (Owner)
- `PUT /api/menu/:id` - Update menu item (Owner)
- `DELETE /api/menu/:id` - Delete menu item (Owner)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/:id` - Get order details

### Deliveries
- `GET /api/deliveries` - Get deliveries (Rider)
- `PUT /api/deliveries/:id` - Update delivery status (Rider)

## 🔧 Development Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🧪 Testing the Setup

### 1. Health Check
Visit `http://localhost:5000/health` - should return server status

### 2. Database Connection
```bash
cd backend
npm run db:studio
```
Opens Prisma Studio at `http://localhost:5555`

### 3. Frontend Connection
Visit `http://localhost:3000` - should show the landing page

### 4. API Test
```bash
curl http://localhost:5000/api/restaurants
```
Should return restaurants list

## 🐳 Docker Services

Access the management interfaces:

- **pgAdmin**: `http://localhost:5050`
  - Email: `admin@chopnow.com`
  - Password: `admin123`

- **Redis Commander**: `http://localhost:8081`

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/chop_now_db?schema=public"
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Reset database
docker-compose down -v
docker-compose up -d
cd backend && npm run db:push && npm run db:seed
```

### Port Conflicts
- Backend: Change `PORT` in `.env`
- Frontend: Use `npm run dev -- -p 3001`
- Database: Change ports in `docker-compose.yml`

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📦 Deployment

### Backend (Production)
```bash
npm run build
npm start
```

### Frontend (Production)
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🎉**
