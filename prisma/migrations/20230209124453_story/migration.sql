/*
  Warnings:

  - You are about to drop the column `latitude` on the `storysteps` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `storysteps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "latitude" INTEGER,
ADD COLUMN     "longitude" INTEGER;

-- AlterTable
ALTER TABLE "storysteps" DROP COLUMN "latitude",
DROP COLUMN "longitude";
