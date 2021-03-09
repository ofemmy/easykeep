-- CreateEnum
CREATE TYPE "Trxfrequency" AS ENUM ('Once', 'Recurring');

-- CreateEnum
CREATE TYPE "trxtype" AS ENUM ('Income', 'Expense');

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "type" "trxtype" NOT NULL,
    "frequency" "Trxfrequency" NOT NULL,
    "entryDate" TIMESTAMPTZ NOT NULL,
    "category" TEXT NOT NULL,
    "recurringFrom" TIMESTAMPTZ,
    "recurringTo" TIMESTAMPTZ,
    "ownerId" INTEGER NOT NULL,

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
ALTER TABLE "transactions" ADD FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
