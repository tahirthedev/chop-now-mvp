# 🍽️ ChopNow - African Food Delivery Platform

ChopNow is a comprehensive food delivery platform specializing in authentic African cuisine. The platform connects food lovers with the best African restaurants, offering a seamless ordering experience with real-time tracking and delivery.

## 🌟 Features

### 🎨 **African-Themed Design**
- Vibrant orange and amber color scheme inspired by African heritage
- Modern, responsive UI built with shadcn/ui components
- Intuitive navigation with cultural elements

### 🏪 **Multi-Restaurant Platform**
- **Nigerian Cuisine**: Jollof rice, Egusi soup, Suya, Pounded yam
- **Ethiopian Delights**: Doro wat, Injera, Vegetarian combinations, Kitfo
- **Ghanaian Specialties**: Banku with tilapia, Kelewele, Waakye
- **Moroccan Flavors**: Tagines, Couscous royal, Pastilla
- **Kenyan Dishes**: Nyama choma, Ugali, Sukuma wiki, Samosas
- **South African Braai**: Boerewors, Bobotie, Biltong platters

### 👤 **Multi-Role System**
- **Customers**: Browse, order, track deliveries, rate restaurants
- **Restaurant Owners**: Manage menus, process orders, update availability
- **Delivery Riders**: Accept deliveries, track routes, update status
- **Admins**: Oversee platform operations, manage users, analytics

### 🚀 **Advanced Features**
- **Real-time Order Tracking**: Live updates via Socket.IO
- **Location-based Search**: Find restaurants by distance and location
- **Advanced Filtering**: Search by cuisine, price, ratings, delivery time
- **Payment Integration**: Secure payment processing
- **Review System**: Customer ratings and feedback
- **Distance Calculation**: Haversine formula for accurate delivery estimates

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 14.2.30 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: Zustand for auth state
- **API Client**: Axios with interceptors
- **Authentication**: JWT-based auth

### **Backend**
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Real-time**: Socket.IO
- **Caching**: Redis
- **Validation**: Joi schemas
- **Security**: Helmet, CORS, Rate limiting

### **Infrastructure**
- **Database**: PostgreSQL
- **Caching**: Redis
- **Image Service**: Custom SVG placeholder generation
- **Development**: Docker Compose for local development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- Redis
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd chop-now
```

### 2. Environment Setup

#### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/chop_now_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=5000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Database Setup
```bash
cd backend
npm install
npx prisma migrate reset --force
npx prisma db seed
```

### 4. Start Services

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

## 👥 Demo Accounts

### Restaurant Owners
- **Nigerian**: mama@afrikas-kitchen.com / owner123
- **Ethiopian**: owner@addis-red-sea.com / owner123
- **Ghanaian**: owner@accra-gold.com / owner123
- **Moroccan**: owner@sahara-spice.com / owner123
- **Kenyan**: owner@nairobi-flavors.com / owner123
- **South African**: owner@cape-town-braai.com / owner123

### Other Roles
- **Admin**: admin@chopnow.com / admin123
- **Customer**: james.wilson@email.com / customer123
- **Rider**: david.rider@delivery.com / rider123

## 📁 Project Structure

```
chop-now/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/            # Utilities and API client
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Database and Redis utilities
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Prisma schema
│   │   └── seed.ts         # Database seeding
│   └── package.json
├── docker-compose.yml       # Local development services
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - List restaurants with filtering
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (owner only)
- `PUT /api/restaurants/:id` - Update restaurant (owner only)

### Menu Items
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `POST /api/menu` - Add menu item (owner only)
- `PUT /api/menu/:id` - Update menu item (owner only)
- `DELETE /api/menu/:id` - Delete menu item (owner only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### Image Service
- `GET /api/placeholder/:width/:height` - Generate placeholder image
- `GET /api/food/:category` - Generate cuisine-specific placeholder

## 🎯 Key Features Implementation

### 🔍 **Location-Based Search**
The platform uses the Haversine formula to calculate distances between user location and restaurants, enabling accurate delivery time estimates and location-based filtering.

### 🔄 **Real-Time Updates**
Socket.IO integration provides live order tracking, status updates, and real-time communication between customers, restaurants, and riders.

### 🛡️ **Security Features**
- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Rate limiting to prevent abuse
- Input validation with Joi schemas
- Security headers with Helmet

### 🎨 **Responsive Design**
Mobile-first design approach with Tailwind CSS ensures optimal experience across all devices, from mobile phones to desktop computers.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Environment Variables
Ensure all environment variables are properly configured for production, including:
- Secure JWT secrets
- Production database URLs
- CORS configuration
- Rate limiting settings

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- African cuisine inspiration from authentic restaurants
- Community feedback and testing
- Open source libraries and frameworks used

---

**ChopNow** - Bringing the authentic taste of Africa to your doorstep! 🌍🍽️
