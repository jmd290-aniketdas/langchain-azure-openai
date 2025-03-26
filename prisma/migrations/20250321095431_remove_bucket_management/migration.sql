/*
  Warnings:

  - You are about to drop the `Bucket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bucketName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `bucketName` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Bucket" DROP CONSTRAINT "Bucket_userId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_bucketId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentFolderId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bucketName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Bucket";

-- DropTable
DROP TABLE "Folder";

-- CreateIndex
CREATE UNIQUE INDEX "User_bucketName_key" ON "User"("bucketName");
