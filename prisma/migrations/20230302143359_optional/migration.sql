-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_firstStepId_fkey";

-- AlterTable
ALTER TABLE "stories" ALTER COLUMN "firstStepId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_firstStepId_fkey" FOREIGN KEY ("firstStepId") REFERENCES "storysteps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
