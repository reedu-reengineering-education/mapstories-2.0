-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "Theme" (
    "name" TEXT NOT NULL,
    "fontFamily" TEXT NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("name")
);
