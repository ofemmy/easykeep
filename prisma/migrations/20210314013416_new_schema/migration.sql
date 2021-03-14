-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_ownerId_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "ownerId" SET DATA TYPE TEXT;
