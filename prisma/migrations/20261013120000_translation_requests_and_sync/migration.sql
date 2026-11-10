-- CreateEnum
CREATE TYPE "TranslationStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "translationOfId" TEXT,
ADD COLUMN     "translationStatus" "TranslationStatus";

-- AlterTable
ALTER TABLE "storysteps" ADD COLUMN     "sourceStepId" TEXT;

-- AlterTable
ALTER TABLE "slidecontent" ADD COLUMN     "needsTranslation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sourceContentId" TEXT;

-- CreateIndex
CREATE INDEX "stories_translationOfId_idx" ON "stories"("translationOfId");

-- CreateIndex
CREATE INDEX "storysteps_sourceStepId_idx" ON "storysteps"("sourceStepId");

-- CreateIndex
CREATE INDEX "slidecontent_sourceContentId_idx" ON "slidecontent"("sourceContentId");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_translationOfId_fkey" FOREIGN KEY ("translationOfId") REFERENCES "stories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storysteps" ADD CONSTRAINT "storysteps_sourceStepId_fkey" FOREIGN KEY ("sourceStepId") REFERENCES "storysteps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slidecontent" ADD CONSTRAINT "slidecontent_sourceContentId_fkey" FOREIGN KEY ("sourceContentId") REFERENCES "slidecontent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

