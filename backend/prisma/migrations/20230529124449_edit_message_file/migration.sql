/*
  Warnings:

  - You are about to drop the column `files` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "files";

-- CreateTable
CREATE TABLE "MessageFile" (
    "id" TEXT NOT NULL,
    "generateName" TEXT NOT NULL,
    "basicName" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,

    CONSTRAINT "MessageFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageFile" ADD CONSTRAINT "MessageFile_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
