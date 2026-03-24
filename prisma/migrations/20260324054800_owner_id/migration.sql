/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Tenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "ownerId",
ALTER COLUMN "totalUsers" DROP NOT NULL,
ALTER COLUMN "coursesCreated" DROP NOT NULL,
ALTER COLUMN "hMac" DROP NOT NULL;
