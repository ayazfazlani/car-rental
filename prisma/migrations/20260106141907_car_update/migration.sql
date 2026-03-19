-- DropIndex
DROP INDEX "car_categories_type_key";

-- AlterTable
ALTER TABLE "car_categories" ADD COLUMN     "showOnHome" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "additionalMileage" DECIMAL(65,30) NOT NULL DEFAULT 10,
ADD COLUMN     "bags" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "doors" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "insurance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mileageLimit" DECIMAL(65,30) NOT NULL DEFAULT 250,
ADD COLUMN     "oneDayRental" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirments" TEXT[];

-- CreateTable
CREATE TABLE "CarFeature" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarFaq" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarFaq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarFeature" ADD CONSTRAINT "CarFeature_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarFaq" ADD CONSTRAINT "CarFaq_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
