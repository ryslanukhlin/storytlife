/*
  Warnings:

  - You are about to drop the column `isOnlite` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnlite",
ADD COLUMN     "is_onlite" BOOLEAN NOT NULL DEFAULT false;
