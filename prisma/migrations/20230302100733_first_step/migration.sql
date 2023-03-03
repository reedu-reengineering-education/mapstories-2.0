/*
  Warnings:

  - A unique constraint covering the columns `[firstStepId]` on the table `stories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstStepId` to the `stories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "firstStepId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "stories_firstStepId_key" ON "stories"("firstStepId");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_firstStepId_fkey" FOREIGN KEY ("firstStepId") REFERENCES "storysteps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
