/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `stories` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `stories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stories" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "stories_slug_key" ON "stories"("slug");
