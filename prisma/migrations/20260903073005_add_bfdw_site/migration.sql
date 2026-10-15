/*
  Warnings:

  - A unique constraint covering the columns `[storyId,site]` on the table `gallery_stories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Site" AS ENUM ('MAIN', 'BFDW');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SITE_ADMIN_BFDW';

-- DropIndex
DROP INDEX "gallery_stories_storyId_key";

-- AlterTable
ALTER TABLE "gallery_stories" ADD COLUMN     "site" "Site" NOT NULL DEFAULT 'MAIN';

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "site" "Site" NOT NULL DEFAULT 'MAIN';

-- CreateIndex
CREATE UNIQUE INDEX "gallery_stories_storyId_site_key" ON "gallery_stories"("storyId", "site");
