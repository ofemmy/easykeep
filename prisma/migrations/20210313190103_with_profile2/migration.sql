/*
  Warnings:

  - The `categories` column on the `user_profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "categories",
ADD COLUMN     "categories" TEXT[];
