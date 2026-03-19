# Luxus Car Rental - Complete Setup Guide

## 🚀 Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd luxus-car-rental
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Create Environment File

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/luxus_car_rental?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
PORT=3000
API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=public/uploads
```

### 4. Setup Database

#### A. Create PostgreSQL Database

```bash
# Using psql
psql -U postgres
CREATE DATABASE luxus_car_rental;
\q

# Or using createdb command
createdb luxus_car_rental
```

#### B. Initialize Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate
```

#### C. Seed Database with Sample Data

```bash
npm run db:seed
```

**This creates:**

- **Super Admin**: `admin@luxus.com` / `admin123`
- **Manager**: `manager@luxus.com` / `admin123`
- **Sample Data**:
  - 3 Car Brands (Mercedes-Benz, BMW, Porsche)
  - 3 Categories (Luxury, SUV, Sports)
  - 3 Sample Cars with images
  - 2 Dealer Locations (Downtown Showroom, Marina Branch)
  - Add-ons (GPS Navigation, Child Seat, Full Insurance)

### 5. Create Upload Directories

```bash
# Windows
mkdir public\uploads\cars
mkdir public\uploads\brands

# macOS/Linux
mkdir -p public/uploads/cars
mkdir -p public/uploads/brands
```

### 6. Start Development Server

```bash
npm run dev
```

**Access Points:**

- 🌐 **Frontend**: `http://localhost:3000`
- 🔐 **Admin Panel**: `http://localhost:3000/admin`
- 🔌 **API**: `http://localhost:3000/api`
- 📚 **Swagger Docs**: `http://localhost:3000/api/swagger`

---

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

### Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@luxus.com",
    "password": "admin123"
  }'
```

### Get Cars (Public API)

```bash
curl http://localhost:3000/api/public/cars
```

### Get Brands (Public API)

```bash
curl http://localhost:3000/api/public/brands
```

### Get Single Car by Slug

```bash
curl http://localhost:3000/api/public/cars/mercedes-benz-g-class-g63-amg-2024
```

### Get Swagger Documentation

```bash
curl http://localhost:3000/api/swagger
```

---

## 🔧 Common Commands

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `npm run dev`         | Start development server with Turbopack |
| `npm run build`       | Build for production                    |
| `npm run start`       | Start production server                 |
| `npm run lint`        | Run ESLint                              |
| `npm run db:generate` | Generate Prisma Client                  |
| `npm run db:push`     | Push schema changes to DB (development) |
| `npm run db:migrate`  | Create and run migrations (production)  |
| `npm run db:studio`   | Open Prisma Studio (database GUI)       |
| `npm run db:seed`     | Seed database with sample data          |
| `npm run db:reset`    | Reset database (⚠️ deletes all data)    |

---

## 🔐 Authentication & Authorization

### Default Admin Credentials

After running `npm run db:seed`:

- **Super Admin**
  - Email: `admin@luxus.com`
  - Password: `admin123`
  - Full access to all features

- **Manager**
  - Email: `manager@luxus.com`
  - Password: `admin123`
  - Limited admin access

### Using Protected Endpoints

All admin endpoints require JWT token in the Authorization header:

```bash
# 1. Login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@luxus.com","password":"admin123"}' \
  | jq -r '.data.accessToken')

# 2. Use token in subsequent requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/admin/cars
```

### JWT Configuration

- **Access Token**: Expires in 15 minutes (configurable via `JWT_EXPIRES_IN`)
- **Refresh Token**: Expires in 7 days (configurable via `JWT_REFRESH_EXPIRES_IN`)
- Tokens are automatically validated on protected routes

---

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at:

- **JSON Format**: `http://localhost:3000/api/swagger`
- **YAML File**: `docs/openapi.yaml`

### Main API Endpoints

#### Public APIs (No Authentication Required)

```
GET  /api/public/cars              → List all cars with filters
GET  /api/public/cars/:id          → Get car by ID or slug
GET  /api/public/brands            → List all brands with car count
GET  /api/public/categories        → List all categories
GET  /api/health                   → Health check endpoint
```

#### Authentication APIs

```
POST /api/auth/register            → Register new customer
POST /api/auth/login               → Login and get JWT token
POST /api/auth/refresh             → Refresh access token
POST /api/auth/logout              → Logout (invalidate tokens)
```

#### Admin APIs (Require JWT Token)

```
GET    /api/admin/cars             → List all cars (admin view)
POST   /api/admin/cars             → Create new car
GET    /api/admin/cars/:id         → Get car details
PUT    /api/admin/cars/:id         → Update car
DELETE /api/admin/cars/:id         → Delete car (soft delete)

POST   /api/admin/cars/:id/images  → Upload car images
DELETE /api/admin/cars/:id/images/:imageId → Delete car image
PATCH  /api/admin/cars/:id/images/:imageId/primary → Set primary image

GET    /api/admin/brands           → List all brands
POST   /api/admin/brands           → Create brand
PUT    /api/admin/brands/:id       → Update brand
DELETE /api/admin/brands/:id       → Delete brand

GET    /api/admin/categories       → List all categories
POST   /api/admin/categories       → Create category
PUT    /api/admin/categories/:id   → Update category
DELETE /api/admin/categories/:id   → Delete category
```

### Example API Requests

#### Get Cars with Filters

```bash
curl "http://localhost:3000/api/public/cars?brandId=1&categoryId=2&minPrice=500&maxPrice=2000&page=1&limit=10"
```

#### Create New Car (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/cars \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "S-Class S500",
    "year": 2024,
    "brandId": 1,
    "categoryId": 1,
    "pricePerDay": 1500,
    "pricePerWeek": 9000,
    "pricePerMonth": 30000,
    "seats": 5,
    "transmission": "Automatic",
    "fuelType": "Petrol",
    "mileage": "Unlimited",
    "features": ["Leather Seats", "Sunroof", "GPS"]
  }'
```

#### Upload Car Images

```bash
curl -X POST http://localhost:3000/api/admin/cars/1/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL

**Solutions**:

```bash
# Check if PostgreSQL is running
# Windows
sc query postgresql-x64-14

# macOS
brew services list | grep postgresql

# Linux
systemctl status postgresql

# Verify database exists
psql -U postgres -l | grep luxus_car_rental

# Test connection
psql -U postgres -d luxus_car_rental
```

### Prisma Issues

**Problem**: Prisma Client out of sync

**Solutions**:

```bash
# Regenerate Prisma Client
npm run db:generate

# Reset database (⚠️ deletes all data)
npm run db:reset

# Check migration status
npx prisma migrate status

# Apply pending migrations
npm run db:migrate
```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solutions**:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <process-id> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

### Upload Directory Permissions

**Problem**: Cannot upload images

**Solutions**:

```bash
# Windows
icacls public\uploads /grant Everyone:F /t

# macOS/Linux
chmod -R 755 public/uploads
chown -R $USER public/uploads
```

### Missing Environment Variables

**Problem**: Application crashes on startup

**Solutions**:

```bash
# Verify .env file exists
cat .env  # macOS/Linux
type .env # Windows

# Check required variables
grep -E "DATABASE_URL|JWT_SECRET" .env
```

### Image Upload Fails

**Problem**: Images not uploading or displaying

**Solutions**:

1. Check upload directories exist:

   ```bash
   ls -la public/uploads/cars
   ls -la public/uploads/brands
   ```

2. Verify file size limits in `.env`:

   ```env
   MAX_FILE_SIZE=5242880  # 5MB in bytes
   ```

3. Check allowed file types:
   ```env
   ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
   ```

### Language Switcher Not Working

**Problem**: Language doesn't change on detail pages

**Solution**: Ensure you're using the correct route structure:

```typescript
// Correct
/en/cars/car-slug
/ar/cars/car-slug

// Incorrect
/cars/car-slug?locale=en
```

### Currency Conversion Issues

**Problem**: Prices showing incorrectly

**Solution**: Check that prices are stored in AED in the database. The system automatically converts based on selected currency.

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run lint

# Verify environment variables
cat .env
```

---

## 📦 Production Deployment

### 1. Environment Setup

Create a production `.env` file:

```env
NODE_ENV="production"
DATABASE_URL="postgresql://prod-user:prod-pass@prod-host:5432/luxus_car_rental"
JWT_SECRET="your-super-secure-production-secret-min-64-chars-random"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-min-64-chars-random"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
API_BASE_URL="https://yourdomain.com/api"
```

### 2. Database Migration

```bash
# Run production migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 3. Build Application

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run start
```

### 4. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Set environment variables in Vercel**:

1. Go to Project Settings → Environment Variables
2. Add all variables from your production `.env`
3. Redeploy

### 5. Deploy to Other Platforms

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### PM2 (VPS/Dedicated Server)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "luxus-car-rental" -- start

# Save PM2 configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

### 6. Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify image uploads work
- [ ] Test language switching
- [ ] Test currency conversion
- [ ] Check admin panel access
- [ ] Verify SSL certificate
- [ ] Test mobile responsiveness
- [ ] Check SEO meta tags
- [ ] Monitor error logs
- [ ] Set up backup strategy

---

## 🔒 Security Best Practices

### Environment Variables

- Never commit `.env` file to Git
- Use different secrets for dev/staging/production
- Rotate JWT secrets regularly
- Use strong, random secrets (min 32 characters)

### Database

- Use connection pooling in production
- Enable SSL for database connections
- Regular backups (automated)
- Implement database access logs

### API Security

- Rate limiting on public endpoints
- Input validation and sanitization
- SQL injection prevention (Prisma handles this)
- XSS protection (React handles this)
- CSRF protection for admin routes

### File Uploads

- Validate file types and sizes
- Scan uploaded files for malware (recommended)
- Store files outside of public web root (if sensitive)
- Use CDN for serving images in production

---

## 📊 Monitoring & Analytics

### Recommended Tools

- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics / Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Database Monitoring**: Prisma Pulse
- **Log Management**: LogRocket / Datadog

### Health Check Endpoint

Monitor application health:

```bash
curl http://localhost:3000/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "database": "connected"
}
```

---

## 📖 Additional Documentation

- **Admin Panel Guide**: See [`ADMIN_PANEL_GUIDE.md`](ADMIN_PANEL_GUIDE.md)
- **Project Summary**: See [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md)
- **API Reference**: See [`docs/openapi.yaml`](docs/openapi.yaml)

---
