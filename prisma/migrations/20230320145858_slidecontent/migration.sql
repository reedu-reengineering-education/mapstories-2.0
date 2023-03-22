/*
  Warnings:

  - You are about to drop the column `image` on the `slidecontent` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `slidecontent` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `slidecontent` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `slidecontent` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `slidecontent` table. All the data in the column will be lost.
  - Added the required column `content` to the `slidecontent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `slidecontent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'TWITTER', 'WIKIPEDIA', 'PADLET', 'TEXT', 'TITLE', 'VIDEO', 'IMAGE');

-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_ownerId_fkey";

-- AlterTable
ALTER TABLE "slidecontent" DROP COLUMN "image",
DROP COLUMN "media",
DROP COLUMN "text",
DROP COLUMN "title",
DROP COLUMN "video",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "options" JSONB,
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
