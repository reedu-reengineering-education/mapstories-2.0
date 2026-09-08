-- CreateTable
CREATE TABLE "storygroups" (
    "id" TEXT NOT NULL,

    CONSTRAINT "storygroups_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'de',
ADD COLUMN     "isTranslation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "groupId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "stories_groupId_language_key" ON "stories"("groupId", "language");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "storygroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
