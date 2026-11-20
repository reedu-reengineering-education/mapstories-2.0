-- CreateTable
CREATE TABLE "gallery_stories" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_stories_storyId_key" ON "gallery_stories"("storyId");

-- AddForeignKey
ALTER TABLE "gallery_stories" ADD CONSTRAINT "gallery_stories_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_stories" ADD CONSTRAINT "gallery_stories_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
