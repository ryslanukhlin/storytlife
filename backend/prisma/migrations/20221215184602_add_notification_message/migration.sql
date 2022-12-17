-- CreateTable
CREATE TABLE "MessageNotification" (
    "id" TEXT NOT NULL,
    "count_new_message" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "MessageNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageNotification_chat_id_key" ON "MessageNotification"("chat_id");

-- AddForeignKey
ALTER TABLE "MessageNotification" ADD CONSTRAINT "MessageNotification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageNotification" ADD CONSTRAINT "MessageNotification_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
