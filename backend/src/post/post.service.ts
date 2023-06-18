import { Injectable } from '@nestjs/common';
import { FileResourceEnum, FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput, CreatePostInput } from 'src/types/graphql';
import { ICurrentUser } from 'src/user/currentUser.decorator';

@Injectable()
export class PostService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileService: FileService,
    ) {}

    async createPost(currentUser: ICurrentUser, createPostInput: CreatePostInput) {
        const { img } = createPostInput;
        const fileName = img ? this.fileService.saveFile(img, FileResourceEnum.POST) : null;

        return await this.prisma.post.create({
            data: {
                ...createPostInput,
                img: fileName,
                user: {
                    connect: { id: currentUser.id },
                },
            },
            include: {
                user: true,
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

    getPosts(sort: 'like' | 'time', paginIter: number) {
        if (sort === 'like') {
            return this.prisma.post.findMany({
                skip: paginIter * 9,
                take: 9,
                include: {
                    user: true,
                },
                orderBy: {
                    likes: {
                        _count: 'desc',
                    },
                },
            });
        }
        return this.prisma.post.findMany({
            skip: paginIter * 9,
            take: 9,
            include: {
                user: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    getUserPosts(userId: string) {
        return this.prisma.post.findMany({
            where: {
                user_id: userId,
            },
            include: {
                user: true,
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

    getPost(postId: string) {
        return this.prisma.post.findFirst({
            where: {
                id: postId,
            },
            include: {
                user: true,
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

    async deletePost(id: string) {
        return await this.prisma.post.delete({
            where: {
                id,
            },
        });
    }

    async editPost(id: string, editData: CreatePostInput) {
        const { img, changePhoto, ...anotherData } = editData;
        if (!changePhoto) {
            return await this.prisma.post.update({
                where: {
                    id,
                },
                data: {
                    ...anotherData,
                },
            });
        }
        const fileName = img ? this.fileService.saveFile(img, FileResourceEnum.POST) : null;

        return await this.prisma.post.update({
            where: {
                id,
            },
            data: {
                ...anotherData,
                img: fileName,
            },
        });
    }
}
