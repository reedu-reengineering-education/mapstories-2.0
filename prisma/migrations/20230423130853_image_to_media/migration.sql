/*
  Warnings:

  - You are about to drop the column `imageId` on the `slidecontent` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mediaId]` on the table `slidecontent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "slidecontent" DROP CONSTRAINT "slidecontent_imageId_fkey";

-- DropIndex
DROP INDEX "slidecontent_imageId_key";

-- AlterTable
ALTER TABLE "slidecontent" DROP COLUMN "imageId",
ADD COLUMN     "mediaId" TEXT;

-- DropTable
DROP TABLE "images";

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT,
    "url" TEXT,
    "altText" TEXT,
    "caption" TEXT,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slidecontent_mediaId_key" ON "slidecontent"("mediaId");

-- AddForeignKey
ALTER TABLE "slidecontent" ADD CONSTRAINT "slidecontent_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
