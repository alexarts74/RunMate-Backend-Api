/*
  Warnings:

  - You are about to drop the `Objective` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Objective" DROP CONSTRAINT "Objective_userId_fkey";

-- AlterTable
ALTER TABLE "RunningPreferences" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Objective";
