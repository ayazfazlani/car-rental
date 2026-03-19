-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "seo_description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seo_keywords" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seo_title" TEXT NOT NULL DEFAULT '';
