-- CreateEnum
CREATE TYPE "MenuItemTag" AS ENUM ('VEG', 'NON_VEG', 'VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'SPICY', 'SWEET', 'HEALTHY', 'HIGH_PROTEIN', 'LOW_CALORIE', 'CHEF_SPECIAL', 'SEASONAL', 'KIDS_FRIENDLY', 'QUICK_BITE');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'LIMITED', 'OUT_OF_STOCK', 'COMMING_SOON');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('DINE_IN', 'TAKEAWAY');

-- AlterTable
ALTER TABLE "Eateries" ADD COLUMN     "services" "ServiceType"[];

-- CreateTable
CREATE TABLE "MenuItems" (
    "id" TEXT NOT NULL,
    "eateryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30),
    "availability" "Availability" NOT NULL DEFAULT 'AVAILABLE',
    "images" TEXT[],
    "prepTimeMin" INTEGER NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "tags" "MenuItemTag"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_eateryId_fkey" FOREIGN KEY ("eateryId") REFERENCES "Eateries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
