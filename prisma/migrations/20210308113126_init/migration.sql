/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Trxfrequency" AS ENUM ('Once', 'Recurring');

-- CreateEnum
CREATE TYPE "Trxtype" AS ENUM ('Income', 'Expense');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "UserSetting" DROP CONSTRAINT "UserSetting_userId_fkey";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserSetting";

-- DropEnum
DROP TYPE "TransactionType";

-- DropEnum
DROP TYPE "TrxFrequency";

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "type" "Trxtype" NOT NULL,
    "frequency" "Trxfrequency" NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "recurring_from" TIMESTAMP(3),
    "recurring_to" TIMESTAMP(3),
    "owner_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
