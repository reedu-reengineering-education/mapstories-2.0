-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
