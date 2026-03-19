-- AlterTable
ALTER TABLE "car_brands" ADD COLUMN     "seo_description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seo_keywords" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seo_title" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "car_categories" ADD COLUMN     "seo_description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seo_keywords" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seo_title" TEXT NOT NULL DEFAULT '';
