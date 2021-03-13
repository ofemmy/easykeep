/*
  Warnings:

  - You are about to drop the `user_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_user_fkey";

-- DropTable
DROP TABLE "user_settings";

-- CreateTable
CREATE TABLE "user_profile" (
    "id" SERIAL NOT NULL,
    "categories" JSONB NOT NULL,
    "currency" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "user" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_user_unique" ON "user_profile"("user");

-- AddForeignKey
ALTER TABLE "user_profile" ADD FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
