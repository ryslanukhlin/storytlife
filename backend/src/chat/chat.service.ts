import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageInput } from 'src/types/graphql';
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

    createRoom(currentUserId: string, userId: string) {
        return this.prisma.chat.create({
            data: {
                users: {
                    connect: [{ id: currentUserId }, { id: userId }],
                },
            },
        });
    }

    async createMessage(currentUser: ICurrentUser, messageInput: MessageInput) {
        return await this.prisma.message.create({
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
    }
}
