import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterInput } from 'src/types/graphql';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(registerInput: RegisterInput) {
        try {
            registerInput.password = bcrypt.hashSync(registerInput.password, 6);
            await this.prisma.user.create({
                data: registerInput,
            });
            return { success: true };
        } catch {
            return { success: false };
        }
    }

    async findOneField(value: string, property: keyof User) {
        return await this.prisma.user.findFirst({
            where: { [property]: value },
        });
    }

    async findId(id: string) {
        return await this.prisma.user.findFirst({
            where: { id },
            include: {
                message_notifications: {
                    include: {
                        chat: true,
                    },
                },
                chats: {
                    include: {
                        users: {
                            where: {
                                NOT: {
                                    id,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    getUsers(id: string) {
        return this.prisma.user.findMany({
            where: {
                NOT: {
                    id,
                },
            },
        });
    }
}
