/*
  Warnings:

  - You are about to drop the column `count_new_message` on the `MessageNotification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MessageNotification" DROP COLUMN "count_new_message",
ADD COLUMN     "messages_id" TEXT[];
