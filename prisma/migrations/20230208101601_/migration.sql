/*
  Warnings:

  - You are about to drop the column `image` on the `stories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "image",
ADD COLUMN     "theme" TEXT;
