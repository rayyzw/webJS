-- CreateTable
CREATE TABLE "Feeling" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "purpose" INTEGER NOT NULL,
    "thinking" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "environment" INTEGER NOT NULL,
    "physical" INTEGER NOT NULL,
    "moving" INTEGER NOT NULL,

    CONSTRAINT "Feeling_pkey" PRIMARY KEY ("id")
);
