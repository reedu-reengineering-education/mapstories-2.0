-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'LAMAPOLL';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT;
