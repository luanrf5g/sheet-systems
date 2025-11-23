/*
  Warnings:

  - Made the column `createdAt` on table `sheets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sheets" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL;
