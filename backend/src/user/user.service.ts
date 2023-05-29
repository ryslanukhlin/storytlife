import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserInput, RegisterInput } from 'src/types/graphql';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ICurrentUser } from './currentUser.decorator';
import { FileResourceEnum, FileService } from 'src/file/file.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileService: FileService,
    ) {}

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

    async getUsers(id: string, search: string | null, paginIter: number) {
        if (!search)
            return await this.prisma
                .$queryRaw`SELECT * FROM public."User" WHERE id != ${id} OFFSET ${
                paginIter * 10
            } LIMIT 10`;
        else {
            search += '%';
            return await this.prisma.$queryRaw`SELECT *
                FROM public."User" WHERE id != ${id} AND 
                (login LIKE ${search} OR name Like ${search} 
                OR surname LIKE ${search} OR patronymic 
                LIKE ${search} OR phone LIKE ${search}) OFFSET ${paginIter * 10} LIMIT 10`;
        }
    }

    async setAvatar(userId: string, avatar: string) {
        const fileName = this.fileService.saveFile(avatar, FileResourceEnum.AVATAR);

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                img: fileName,
            },
        });

        return fileName;
    }

    async setBg(userId: string, avatar: string) {
        const fileName = this.fileService.saveFile(avatar, FileResourceEnum.BG);

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                bg: fileName,
            },
        });

        return fileName;
    }

    async updateOnlineStatus(userId: string, online: boolean) {
        return await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                is_onlite: online,
            },
        });
    }

    async editUser(id: string, editUser: EditUserInput) {
        const { birthday, ...data } = editUser;
        const date = new Date(birthday);

        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...data,
                birthday: birthday && date,
            },
        });
    }
}
