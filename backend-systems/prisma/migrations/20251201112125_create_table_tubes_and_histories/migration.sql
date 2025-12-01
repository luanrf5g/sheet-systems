-- CreateEnum
CREATE TYPE "TubeType" AS ENUM ('TUBE_SQUARE', 'TUBE_RECTANGLE', 'TUBE_ROUND', 'L_SHAPED');

-- CreateTable
CREATE TABLE "tubes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" "TubeType" NOT NULL,
    "material" TEXT NOT NULL,
    "thickness" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tubes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TubeHistory" (
    "id" SERIAL NOT NULL,
    "tubeId" INTEGER NOT NULL,
    "alteredField" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "user" TEXT,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TubeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tubes_code_key" ON "tubes"("code");

-- AddForeignKey
ALTER TABLE "TubeHistory" ADD CONSTRAINT "TubeHistory_tubeId_fkey" FOREIGN KEY ("tubeId") REFERENCES "tubes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
