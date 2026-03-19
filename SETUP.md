# Quick Setup Guide

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/luxus_car_rental?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
API_BASE_URL="http://localhost:3000/api"
```

### 3. Setup Database

#### Create PostgreSQL Database

```bash
# Using psql
psql -U postgres
CREATE DATABASE luxus_car_rental;
\q

# Or using createdb command
createdb luxus_car_rental
```

#### Initialize Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate
```

#### Seed Database (Optional)

```bash
npm run db:seed
```

This will create:

- Super Admin: `admin@luxus.com` / `admin123`
- Admin: `manager@luxus.com` / `admin123`
- Sample brands, categories, cars, and add-ons

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## 📝 Quick Test

### Register a Customer

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@luxus.com",
    "password": "admin123"
  }'
```

### Get Cars (Public)

```bash
curl http://localhost:3000/api/public/cars
```

### Get Swagger Documentation

```bash
curl http://localhost:3000/api/swagger
```

## 🔧 Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes (dev)
- `npm run db:migrate` - Create migration (production)
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run lint` - Run ESLint

## 📚 API Documentation

Access Swagger documentation at:

- **JSON**: `http://localhost:3000/api/swagger`
- Import into Postman or Swagger UI for interactive docs

## 🔐 Authentication

All protected endpoints require JWT token:

```
Authorization: Bearer <access_token>
```

Get token from `/api/auth/login` or `/api/auth/register`

## 🎯 Next Steps

1. ✅ Database schema created
2. ✅ API routes implemented
3. ✅ Authentication system ready
4. ✅ Admin panel endpoints ready
5. ⏭️ Connect your frontend
6. ⏭️ Add image upload functionality
7. ⏭️ Integrate payment gateway
8. ⏭️ Add email/SMS notifications

## 🐛 Troubleshooting

### Database Connection Issues

- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env` is correct
- Ensure database exists: `psql -l | grep luxus`

### Prisma Issues

- Run `npm run db:generate` after schema changes
- Use `npm run db:push` for development (faster)
- Use `npm run db:migrate` for production (safer)

### Port Already in Use

- Change PORT in `.env` file
- Or kill process: `lsof -ti:3000 | xargs kill`
