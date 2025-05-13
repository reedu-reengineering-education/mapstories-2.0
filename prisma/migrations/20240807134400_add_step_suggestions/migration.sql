-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "slidecontent" ADD COLUMN     "suggestionId" TEXT;

-- CreateTable
CREATE TABLE "storystepsuggestions" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "proposedStep" JSONB NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storystepsuggestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "storystepsuggestions" ADD CONSTRAINT "storystepsuggestions_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slidecontent" ADD CONSTRAINT "slidecontent_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "storystepsuggestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
