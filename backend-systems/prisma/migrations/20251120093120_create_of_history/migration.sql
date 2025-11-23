-- CreateTable
CREATE TABLE "SheetHistory" (
    "id" SERIAL NOT NULL,
    "sheetId" INTEGER NOT NULL,
    "alteredField" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "user" TEXT,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SheetHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SheetHistory" ADD CONSTRAINT "SheetHistory_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
