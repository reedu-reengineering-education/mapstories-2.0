/*
  Warnings:

  - A unique constraint covering the columns `[imageName]` on the table `slidecontent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "slidecontent" ADD COLUMN     "imageName" TEXT;

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_name_key" ON "images"("name");

-- CreateIndex
CREATE UNIQUE INDEX "slidecontent_imageName_key" ON "slidecontent"("imageName");

-- AddForeignKey
ALTER TABLE "slidecontent" ADD CONSTRAINT "slidecontent_imageName_fkey" FOREIGN KEY ("imageName") REFERENCES "images"("name") ON DELETE SET NULL ON UPDATE CASCADE;
