/*
  Warnings:

  - Added the required column `position` to the `storysteps` table without a default value. This is not possible if the table is not empty.
  - Made the column `storyId` on table `storysteps` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "storysteps" ADD COLUMN     "position" INTEGER NOT NULL,
ALTER COLUMN "storyId" SET NOT NULL;
