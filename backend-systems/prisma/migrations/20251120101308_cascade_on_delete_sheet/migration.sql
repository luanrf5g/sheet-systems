-- DropForeignKey
ALTER TABLE "SheetHistory" DROP CONSTRAINT "SheetHistory_sheetId_fkey";

-- AddForeignKey
ALTER TABLE "SheetHistory" ADD CONSTRAINT "SheetHistory_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
