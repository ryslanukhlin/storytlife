import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput, CreatePostInput } from 'src/types/graphql';
import { ICurrentUser } from 'src/user/currentUser.decorator';
import * as fs from 'fs';
import { v4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) {}

    async createPost(currentUser: ICurrentUser, createPostInput: CreatePostInput) {
        const { img } = createPostInput;
        let fileName = null;
        if (img) {
            const fileExpansion = img.substring(img.indexOf('/') + 1, img.indexOf(';'));

            fileName = v4() + '.' + fileExpansion;
            const filePath = path.resolve(__dirname, '..', '..', 'public', 'img', 'post');

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            const imageFormatBase64 = createPostInput.img.split(',', 2)[1];

            fs.writeFileSync(path.resolve(filePath, fileName), imageFormatBase64, {
                encoding: 'base64',
            });
        }

        return await this.prisma.post.create({
            data: {
                ...createPostInput,
                img: fileName,
                user: {
                    connect: { id: currentUser.id },
                },
            },
            include: {
                likes: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    getUserPosts(currentUser: ICurrentUser) {
        return this.prisma.post.findMany({
            where: {
                user_id: currentUser.id,
            },
            include: {
                likes: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    async addLike(userId: string, postId: string) {
        return await this.prisma.like.create({
            data: {
                post: {
                    connect: { id: postId },
                },
                user: {
                    connect: { id: userId },
                },
            },
            include: {
                user: true,
            },
        });
    }

    async addComment(userId: string, createCommentInput: CreateCommentInput) {
        return await this.prisma.comment.create({
            data: {
                txt: createCommentInput.txt,
                post: {
                    connect: { id: createCommentInput.postId },
                },
                user: {
                    connect: { id: userId },
                },
            },
            include: {
                user: true,
            },
        });
    }
}
