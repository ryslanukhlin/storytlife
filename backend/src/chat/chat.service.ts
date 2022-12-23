import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteInputNotification, MessageInput } from 'src/types/graphql';
import { ICurrentUser } from 'src/user/currentUser.decorator';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    getMessages(roomId: string) {
        return this.prisma.message.findMany({
            where: {
                chat_id: roomId,
            },
        });
    }

    async createRoom(currentUserId: string, userId: string) {
        return await this.prisma.chat.create({
            data: {
                users: {
                    connect: [{ id: currentUserId }, { id: userId }],
                },
            },
            include: {
                users: true,
            },
        });
    }

    async createMessage(currentUser: ICurrentUser, messageInput: MessageInput) {
        const message = await this.prisma.message.create({
            data: {
                text: messageInput.txt,
                user: {
                    connect: { id: currentUser.id },
                },
                chat: {
                    connect: { id: messageInput.roomId },
                },
            },
        });
        let notification = await this.prisma.messageNotification.findFirst({
            where: {
                chat_id: message.chat_id,
                AND: {
                    user: {
                        id: messageInput.userId,
                    },
                },
            },
        });

        if (notification) {
            notification = await this.prisma.messageNotification.update({
                where: {
                    id: notification.id,
                },
                data: {
                    messages_id: [...notification.messages_id, message.id],
                },
                include: {
                    chat: true,
                },
            });
        } else {
            notification = await this.prisma.messageNotification.create({
                data: {
                    messages_id: [message.id],
                    user: {
                        connect: { id: messageInput.userId },
                    },
                    chat: {
                        connect: { id: messageInput.roomId },
                    },
                },
                include: {
                    chat: true,
                },
            });
        }

        return { message, notification };
    }

    async deleteNotification(deleteInput: DeleteInputNotification) {
        await this.prisma
            .$queryRaw`update "MessageNotification" set messages_id = array_remove(messages_id, ${deleteInput.messageId})`;
    }
}
