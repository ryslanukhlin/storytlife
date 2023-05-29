-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "files" TEXT[] DEFAULT ARRAY[]::TEXT[];
