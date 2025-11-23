-- CreateTable
CREATE TABLE "sheets" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "thickness" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sheets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sheets_code_key" ON "sheets"("code");
