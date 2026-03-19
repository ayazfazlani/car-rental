/*
  Warnings:

  - You are about to drop the column `phone` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `value` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PHONE', 'EMAIL', 'WHATSAPP');

-- AlterTable
ALTER TABLE "Contact" RENAME COLUMN "phone" TO "value";
ALTER TABLE "Contact" ADD COLUMN "type" "ContactType" NOT NULL DEFAULT 'PHONE';
