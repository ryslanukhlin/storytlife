/*
  Warnings:

  - You are about to drop the `MessageFile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `files` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MessageFile" DROP CONSTRAINT "MessageFile_message_id_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "files" JSONB NOT NULL;

-- DropTable
DROP TABLE "MessageFile";
