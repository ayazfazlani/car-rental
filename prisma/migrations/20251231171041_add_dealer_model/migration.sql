-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "CarCategoryType" AS ENUM ('SEDAN', 'SUV', 'SPORTS', 'LUXURY', 'COUPE', 'CONVERTIBLE');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('AUTOMATIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'MAINTENANCE', 'DELETED');

-- CreateEnum
CREATE TYPE "RentalPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE', 'LOGIN', 'LOGOUT', 'PERMISSION_CHANGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" TEXT,
    "department" TEXT,
    "permissions" JSONB,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "car_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_categories" (
    "id" TEXT NOT NULL,
    "type" "CarCategoryType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "car_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "dealerId" TEXT,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "transmission" "TransmissionType" NOT NULL,
    "fuelType" "FuelType" NOT NULL,
    "seats" INTEGER NOT NULL,
    "engineSize" TEXT,
    "horsepower" INTEGER,
    "topSpeed" INTEGER,
    "acceleration" DOUBLE PRECISION,
    "hasChauffeur" BOOLEAN NOT NULL DEFAULT false,
    "hasSelfDrive" BOOLEAN NOT NULL DEFAULT true,
    "hasGPS" BOOLEAN NOT NULL DEFAULT true,
    "hasBluetooth" BOOLEAN NOT NULL DEFAULT true,
    "hasSunroof" BOOLEAN NOT NULL DEFAULT false,
    "hasLeatherSeats" BOOLEAN NOT NULL DEFAULT true,
    "hasBackupCamera" BOOLEAN NOT NULL DEFAULT true,
    "baseDailyPrice" DECIMAL(10,2) NOT NULL,
    "baseWeeklyPrice" DECIMAL(10,2),
    "baseMonthlyPrice" DECIMAL(10,2),
    "chauffeurDailyPrice" DECIMAL(10,2),
    "status" "CarStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "highlights" TEXT[],
    "color" TEXT,
    "licensePlate" TEXT,
    "vin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_images" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "car_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_pricing" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "period" "RentalPeriod" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "isChauffeur" BOOLEAN NOT NULL DEFAULT false,
    "minDays" INTEGER,
    "maxDays" INTEGER,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "rental_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_availability" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "car_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "location" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "dealers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_userId_key" ON "admin_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_employeeId_key" ON "admin_profiles"("employeeId");

-- CreateIndex
CREATE INDEX "admin_profiles_userId_idx" ON "admin_profiles"("userId");

-- CreateIndex
CREATE INDEX "admin_profiles_employeeId_idx" ON "admin_profiles"("employeeId");

-- CreateIndex
CREATE INDEX "admin_profiles_deletedAt_idx" ON "admin_profiles"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "car_brands_name_key" ON "car_brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "car_brands_slug_key" ON "car_brands"("slug");

-- CreateIndex
CREATE INDEX "car_brands_slug_idx" ON "car_brands"("slug");

-- CreateIndex
CREATE INDEX "car_brands_isActive_idx" ON "car_brands"("isActive");

-- CreateIndex
CREATE INDEX "car_brands_deletedAt_idx" ON "car_brands"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "car_categories_type_key" ON "car_categories"("type");

-- CreateIndex
CREATE UNIQUE INDEX "car_categories_name_key" ON "car_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "car_categories_slug_key" ON "car_categories"("slug");

-- CreateIndex
CREATE INDEX "car_categories_type_idx" ON "car_categories"("type");

-- CreateIndex
CREATE INDEX "car_categories_slug_idx" ON "car_categories"("slug");

-- CreateIndex
CREATE INDEX "car_categories_isActive_idx" ON "car_categories"("isActive");

-- CreateIndex
CREATE INDEX "car_categories_deletedAt_idx" ON "car_categories"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cars_slug_key" ON "cars"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cars_licensePlate_key" ON "cars"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "cars_vin_key" ON "cars"("vin");

-- CreateIndex
CREATE INDEX "cars_brandId_idx" ON "cars"("brandId");

-- CreateIndex
CREATE INDEX "cars_categoryId_idx" ON "cars"("categoryId");

-- CreateIndex
CREATE INDEX "cars_dealerId_idx" ON "cars"("dealerId");

-- CreateIndex
CREATE INDEX "cars_model_idx" ON "cars"("model");

-- CreateIndex
CREATE INDEX "cars_transmission_idx" ON "cars"("transmission");

-- CreateIndex
CREATE INDEX "cars_fuelType_idx" ON "cars"("fuelType");

-- CreateIndex
CREATE INDEX "cars_seats_idx" ON "cars"("seats");

-- CreateIndex
CREATE INDEX "cars_hasChauffeur_idx" ON "cars"("hasChauffeur");

-- CreateIndex
CREATE INDEX "cars_hasSelfDrive_idx" ON "cars"("hasSelfDrive");

-- CreateIndex
CREATE INDEX "cars_status_idx" ON "cars"("status");

-- CreateIndex
CREATE INDEX "cars_baseDailyPrice_idx" ON "cars"("baseDailyPrice");

-- CreateIndex
CREATE INDEX "cars_baseWeeklyPrice_idx" ON "cars"("baseWeeklyPrice");

-- CreateIndex
CREATE INDEX "cars_baseMonthlyPrice_idx" ON "cars"("baseMonthlyPrice");

-- CreateIndex
CREATE INDEX "cars_slug_idx" ON "cars"("slug");

-- CreateIndex
CREATE INDEX "cars_deletedAt_idx" ON "cars"("deletedAt");

-- CreateIndex
CREATE INDEX "cars_brandId_categoryId_status_idx" ON "cars"("brandId", "categoryId", "status");

-- CreateIndex
CREATE INDEX "cars_hasChauffeur_hasSelfDrive_status_idx" ON "cars"("hasChauffeur", "hasSelfDrive", "status");

-- CreateIndex
CREATE INDEX "cars_transmission_fuelType_seats_status_idx" ON "cars"("transmission", "fuelType", "seats", "status");

-- CreateIndex
CREATE INDEX "car_images_carId_idx" ON "car_images"("carId");

-- CreateIndex
CREATE INDEX "car_images_carId_isPrimary_idx" ON "car_images"("carId", "isPrimary");

-- CreateIndex
CREATE INDEX "car_images_carId_displayOrder_idx" ON "car_images"("carId", "displayOrder");

-- CreateIndex
CREATE INDEX "car_images_deletedAt_idx" ON "car_images"("deletedAt");

-- CreateIndex
CREATE INDEX "rental_pricing_carId_idx" ON "rental_pricing"("carId");

-- CreateIndex
CREATE INDEX "rental_pricing_period_idx" ON "rental_pricing"("period");

-- CreateIndex
CREATE INDEX "rental_pricing_isChauffeur_idx" ON "rental_pricing"("isChauffeur");

-- CreateIndex
CREATE INDEX "rental_pricing_isActive_idx" ON "rental_pricing"("isActive");

-- CreateIndex
CREATE INDEX "rental_pricing_validFrom_validUntil_idx" ON "rental_pricing"("validFrom", "validUntil");

-- CreateIndex
CREATE INDEX "rental_pricing_carId_period_isChauffeur_isActive_idx" ON "rental_pricing"("carId", "period", "isChauffeur", "isActive");

-- CreateIndex
CREATE INDEX "rental_pricing_deletedAt_idx" ON "rental_pricing"("deletedAt");

-- CreateIndex
CREATE INDEX "car_availability_carId_idx" ON "car_availability"("carId");

-- CreateIndex
CREATE INDEX "car_availability_date_idx" ON "car_availability"("date");

-- CreateIndex
CREATE INDEX "car_availability_isAvailable_idx" ON "car_availability"("isAvailable");

-- CreateIndex
CREATE INDEX "car_availability_carId_date_isAvailable_idx" ON "car_availability"("carId", "date", "isAvailable");

-- CreateIndex
CREATE INDEX "car_availability_date_isAvailable_idx" ON "car_availability"("date", "isAvailable");

-- CreateIndex
CREATE INDEX "car_availability_deletedAt_idx" ON "car_availability"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "car_availability_carId_date_key" ON "car_availability"("carId", "date");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE INDEX "reviews_carId_idx" ON "reviews"("carId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "reviews_isPublished_idx" ON "reviews"("isPublished");

-- CreateIndex
CREATE INDEX "reviews_carId_isPublished_idx" ON "reviews"("carId", "isPublished");

-- CreateIndex
CREATE INDEX "reviews_deletedAt_idx" ON "reviews"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "dealers_slug_key" ON "dealers"("slug");

-- CreateIndex
CREATE INDEX "dealers_slug_idx" ON "dealers"("slug");

-- CreateIndex
CREATE INDEX "dealers_isActive_idx" ON "dealers"("isActive");

-- CreateIndex
CREATE INDEX "dealers_deletedAt_idx" ON "dealers"("deletedAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_adminId_idx" ON "admin_audit_logs"("adminId");

-- CreateIndex
CREATE INDEX "admin_audit_logs_userId_idx" ON "admin_audit_logs"("userId");

-- CreateIndex
CREATE INDEX "admin_audit_logs_action_idx" ON "admin_audit_logs"("action");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entityType_idx" ON "admin_audit_logs"("entityType");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entityId_idx" ON "admin_audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "admin_audit_logs_createdAt_idx" ON "admin_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_adminId_createdAt_idx" ON "admin_audit_logs"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entityType_entityId_idx" ON "admin_audit_logs"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "car_brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "car_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_pricing" ADD CONSTRAINT "rental_pricing_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_availability" ADD CONSTRAINT "car_availability_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
