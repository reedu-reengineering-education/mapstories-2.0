-- DropForeignKey
ALTER TABLE "slidecontent" DROP CONSTRAINT "slidecontent_storyStepId_fkey";

-- AddForeignKey
ALTER TABLE "slidecontent" ADD CONSTRAINT "slidecontent_storyStepId_fkey" FOREIGN KEY ("storyStepId") REFERENCES "storysteps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
