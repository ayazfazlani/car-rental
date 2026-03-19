/*
  Warnings:

  - Added the required column `answer_ar` to the `faq` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_ar` to the `faq` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faq" ADD COLUMN     "answer_ar" TEXT NOT NULL,
ADD COLUMN     "question_ar" TEXT NOT NULL;
