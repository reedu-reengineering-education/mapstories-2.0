-- AlterTable
ALTER TABLE "_contributors" ADD CONSTRAINT "_contributors_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_contributors_AB_unique";
