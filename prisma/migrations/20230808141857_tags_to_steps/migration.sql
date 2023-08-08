/*
  Warnings:

  - You are about to drop the column `tags` on the `slidecontent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "slidecontent" DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "storysteps" ADD COLUMN     "tags" TEXT[];
