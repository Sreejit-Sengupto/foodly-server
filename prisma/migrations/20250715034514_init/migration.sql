/*
  Warnings:

  - The values [COMMING_SOON] on the enum `Availability` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Availability_new" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'LIMITED', 'OUT_OF_STOCK', 'COMING_SOON');
ALTER TABLE "MenuItems" ALTER COLUMN "availability" DROP DEFAULT;
ALTER TABLE "MenuItems" ALTER COLUMN "availability" TYPE "Availability_new" USING ("availability"::text::"Availability_new");
ALTER TYPE "Availability" RENAME TO "Availability_old";
ALTER TYPE "Availability_new" RENAME TO "Availability";
DROP TYPE "Availability_old";
ALTER TABLE "MenuItems" ALTER COLUMN "availability" SET DEFAULT 'AVAILABLE';
COMMIT;
