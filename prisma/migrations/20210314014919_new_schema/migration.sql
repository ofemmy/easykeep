/*
  Warnings:

  - You are about to drop the column `user` on the `user_profile` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `user_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "user",
ADD COLUMN     "ownerId" TEXT NOT NULL;
