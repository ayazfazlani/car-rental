-- CreateTable
CREATE TABLE "rental_terms" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_terms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rental_terms_carId_idx" ON "rental_terms"("carId");

-- AddForeignKey
ALTER TABLE "rental_terms" ADD CONSTRAINT "rental_terms_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
