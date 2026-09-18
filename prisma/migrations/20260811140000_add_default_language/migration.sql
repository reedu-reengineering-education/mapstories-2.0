-- AlterTable
ALTER TABLE "stories" ADD COLUMN "defaultLanguage" TEXT;

-- Set defaultLanguage to current language for all existing stories
-- Stories with isTranslation=false become the default (canonical) version
UPDATE "stories" SET "defaultLanguage" = "language" WHERE "isTranslation" = false;
