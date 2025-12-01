/*
  Warnings:

  - The values [TUBE_SQUARE,TUBE_RECTANGLE,TUBE_ROUND] on the enum `TubeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TubeType_new" AS ENUM ('SQUARE', 'RECTANGLE', 'ROUND', 'L_SHAPED');
ALTER TABLE "tubes" ALTER COLUMN "type" TYPE "TubeType_new" USING ("type"::text::"TubeType_new");
ALTER TYPE "TubeType" RENAME TO "TubeType_old";
ALTER TYPE "TubeType_new" RENAME TO "TubeType";
DROP TYPE "public"."TubeType_old";
COMMIT;
