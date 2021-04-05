-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "budget" DECIMAL(65,30),
    "rollOver" BOOLEAN,
    "runningBudget" DECIMAL(65,30),
    "ownerId" TEXT NOT NULL,
    "type" "trxtype" NOT NULL,

    PRIMARY KEY ("id")
);
