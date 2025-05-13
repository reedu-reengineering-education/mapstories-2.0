/*
  Warnings:

  - You are about to drop the column `created_at` on the `storystepsuggestions` table. All the data in the column will be lost.
  - You are about to drop the column `proposedStep` on the `storystepsuggestions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `storystepsuggestions` table. All the data in the column will be lost.
  - Added the required column `position` to the `storystepsuggestions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewport` to the `storystepsuggestions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "storystepsuggestions" DROP COLUMN "created_at",
DROP COLUMN "proposedStep",
DROP COLUMN "updated_at",
ADD COLUMN     "feature" JSONB,
ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "timestamp" TIMESTAMP(3),
ADD COLUMN     "viewport" JSONB NOT NULL,
ALTER COLUMN "storyId" DROP NOT NULL;
