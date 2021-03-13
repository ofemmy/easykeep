-- CreateTable
CREATE TABLE "user_settings" (
    "id" SERIAL NOT NULL,
    "categories" TEXT[],
    "currency" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "user" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_unique" ON "user_settings"("user");

-- AddForeignKey
ALTER TABLE "user_settings" ADD FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
