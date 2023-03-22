/*
  Warnings:

  - Added the required column `position` to the `slidecontent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "slidecontent" ADD COLUMN     "position" INTEGER NOT NULL;
