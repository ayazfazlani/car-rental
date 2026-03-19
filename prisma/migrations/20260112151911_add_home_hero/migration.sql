-- CreateTable
CREATE TABLE "home_hero" (
    "id" TEXT NOT NULL,
    "tagline" TEXT,
    "tagline_ar" TEXT,
    "heading" TEXT,
    "heading_ar" TEXT,
    "description" TEXT,
    "description_ar" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_hero_pkey" PRIMARY KEY ("id")
);
