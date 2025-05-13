/*
  Warnings:

  - You are about to drop the column `theme` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "theme",
ADD COLUMN     "themeId" TEXT;

-- DropTable
DROP TABLE "Theme";

-- CreateTable
CREATE TABLE "theme" (
    "name" TEXT NOT NULL,
    "fontFamily" TEXT,
    "shadow_color" TEXT,
    "border" TEXT,
    "box_shadow" TEXT,
    "border_radius" TEXT,
    "text_color" TEXT,
    "background_color" TEXT,
    "button_color" TEXT,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "theme"("name") ON DELETE SET NULL ON UPDATE CASCADE;
