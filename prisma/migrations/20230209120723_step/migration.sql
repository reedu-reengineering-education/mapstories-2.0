/*
  Warnings:

  - You are about to drop the column `latitude` on the `slidecontent` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `slidecontent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "slidecontent" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "storysteps" ADD COLUMN     "latitude" INTEGER,
ADD COLUMN     "longitude" INTEGER;
