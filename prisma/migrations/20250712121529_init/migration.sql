-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PROFILE', 'MENU_ITEM', 'EATERY_COVER');

-- CreateTable
CREATE TABLE "ShortURL" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'PROFILE',

    CONSTRAINT "ShortURL_pkey" PRIMARY KEY ("id")
);
