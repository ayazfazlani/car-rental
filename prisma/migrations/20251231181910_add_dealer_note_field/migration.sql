/*
  Warnings:

  - You are about to drop the column `address` on the `dealers` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `dealers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `dealers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dealers" DROP COLUMN "address",
DROP COLUMN "description",
DROP COLUMN "email",
ADD COLUMN     "note" TEXT;
