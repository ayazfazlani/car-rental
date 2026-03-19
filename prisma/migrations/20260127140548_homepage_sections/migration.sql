-- CreateEnum
CREATE TYPE "HomePageSectionType" AS ENUM ('HERO', 'AFFORDABLE_CARS', 'RECOMMENDED_CARS', 'BRANDS', 'CATEGORIES', 'FAQ', 'TESTIMONIALS', 'CUSTOM');

-- CreateTable
CREATE TABLE "home_page_sections" (
    "id" TEXT NOT NULL,
    "type" "HomePageSectionType" NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "order" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "config_ar" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "home_page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "home_page_sections_type_key" ON "home_page_sections"("type");

-- CreateIndex
CREATE INDEX "home_page_sections_order_idx" ON "home_page_sections"("order");

-- CreateIndex
CREATE INDEX "home_page_sections_isVisible_idx" ON "home_page_sections"("isVisible");

-- CreateIndex
CREATE INDEX "home_page_sections_deletedAt_idx" ON "home_page_sections"("deletedAt");
