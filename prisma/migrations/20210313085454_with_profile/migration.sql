/*
  Warnings:

  - Changed the type of `categories` on the `user_settings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_settings" DROP COLUMN "categories",
ADD COLUMN     "categories" JSONB NOT NULL;
