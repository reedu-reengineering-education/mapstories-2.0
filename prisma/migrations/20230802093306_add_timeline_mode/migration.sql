-- CreateEnum
CREATE TYPE "StoryMode" AS ENUM ('NORMAL', 'TIMELINE');

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "mode" "StoryMode" NOT NULL DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE "storysteps" ADD COLUMN     "timestamp" TIMESTAMP(3);
