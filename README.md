# Luxus Car Rental - Backend API

Production-grade backend API for luxury car rental platform built with Next.js 16, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Car Management**: Complete CRUD operations with advanced filtering
- **Booking System**: Full booking lifecycle with availability checks
- **Payment Processing**: Payment tracking and management
- **Admin Panel**: Comprehensive admin endpoints for inventory and booking management
- **Audit Logging**: Complete audit trail for admin actions
- **API Documentation**: Swagger/OpenAPI documentation endpoint

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb luxus_car_rental
# Or using psql:
# psql -U postgres
# CREATE DATABASE luxus_car_rental;
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/luxus_car_rental?schema=public"

# JWT Secrets (Change these in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# App Configuration
NODE_ENV="development"
PORT=3000
API_BASE_URL="http://localhost:3000/api"

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## 📚 API Documentation

### Swagger UI

Once the server is running, access the Swagger documentation at:

- **Swagger UI (Interactive)**: `http://localhost:3000/api/swagger-ui` - Full interactive documentation with try-it-out feature
- **Swagger JSON**: `http://localhost:3000/api/swagger` - OpenAPI 3.0.3 specification (JSON format)
- Import the JSON URL into Postman or other API clients for testing

### API Endpoints Overview

#### Authentication

- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh access token

#### Public Endpoints (No Auth Required)

- `GET /api/public/cars` - Browse cars with filtering
- `GET /api/public/cars/:carId` - Get car details
- `GET /api/public/cars/:carId/availability` - Check availability
- `GET /api/public/brands` - Get all brands
- `GET /api/public/categories` - Get all categories
- `GET /api/public/add-ons` - Get all add-ons

#### Customer Endpoints (Auth Required)

- `GET /api/bookings` - List user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:bookingId` - Get booking details
- `PATCH /api/bookings/:bookingId` - Update booking (cancel)
- `POST /api/bookings/:bookingId/payment` - Process payment
- `POST /api/bookings/:bookingId/review` - Submit review

#### Admin Endpoints (Admin Auth Required)

- `GET /api/admin/cars` - List all cars
- `POST /api/admin/cars` - Create car
- `GET /api/admin/cars/:carId` - Get car details
- `PATCH /api/admin/cars/:carId` - Update car
- `DELETE /api/admin/cars/:carId` - Delete car
- `POST /api/admin/cars/:carId/availability` - Set availability
- `POST /api/admin/cars/:carId/pricing` - Add pricing tier
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/bookings/:bookingId` - Get booking details
- `PATCH /api/admin/bookings/:bookingId` - Update booking status
- `GET /api/admin/brands` - List brands
- `POST /api/admin/brands` - Create brand
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Getting an Access Token

1. Register or login to get `accessToken` and `refreshToken`
2. Use `accessToken` for API requests
3. Use `refreshToken` to get a new `accessToken` when it expires

## 🗄️ Database Schema

The database schema includes:

- **Users**: Authentication and user management
- **Cars**: Car inventory with specifications
- **Bookings**: Rental bookings with status lifecycle
- **Payments**: Payment tracking
- **Reviews**: Customer reviews
- **AdminAuditLog**: Audit trail for admin actions

See `prisma/schema.prisma` for complete schema definition.

## 🧪 Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'

# Get cars (public)
curl http://localhost:3000/api/public/cars

# Create booking (requires auth token)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "carId": "car-id",
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "isChauffeur": false
  }'
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
luxus/
├── app/
│   └── api/              # API routes
│       ├── auth/         # Authentication endpoints
│       ├── public/       # Public endpoints
│       ├── bookings/     # Booking endpoints
│       └── admin/        # Admin endpoints
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # JWT utilities
│   ├── middleware.ts     # Auth middleware
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Soft deletes for data retention
- Input validation with Zod
- SQL injection protection via Prisma

## 📊 Filtering & Search

The API supports advanced filtering for cars:

- Brand, Category, Model
- Price range (daily/weekly/monthly)
- Transmission, Fuel Type, Seats
- Chauffeur/Self-drive availability
- Date-based availability
- Admin status filters

Example:

```
GET /api/public/cars?brandId=xxx&minPrice=100&maxPrice=500&transmission=AUTOMATIC&hasChauffeur=true
```

## 🚧 Future Enhancements

- [ ] Image upload for car photos
- [ ] Email notifications
- [ ] SMS notifications (WhatsApp integration)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Advanced reporting and analytics
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] API versioning

## 📄 License

Private - All rights reserved

## 👥 Support

For issues or questions, contact the development team.
