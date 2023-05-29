import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { CreateCommentInput, CreatePostInput } from 'src/types/graphql';
import { CurrentUser, ICurrentUser } from 'src/user/currentUser.decorator';
import { PostService } from './post.service';

enum SUBSCRIPTIONS_EVENT {
    NEW_POST = 'NEW_POST',
    ADD_LIKE = 'ADD_LIKE',
    ADD_COMMENT = 'ADD_COMMENT',
    DELETE_POST = 'DELETE_POST',
    EDIT_POST = 'EDIT_POST',
}

@Resolver()
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) {}

    @Query()
    getUserPosts(@Args('userId') userId: string) {
        return this.postService.getUserPosts(userId);
    }

    @Query()
    getPosts(@Args('sort') sort: 'like' | 'time', @Args('paginIter') paginIter: number = 0) {
        return this.postService.getPosts(sort, paginIter);
    }

    @Query()
    getPost(@Args('postId') postId: string) {
        return this.postService.getPost(postId);
    }

    @Mutation()
    async createPost(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('createPost') createPost: CreatePostInput,
    ) {
        const post = await this.postService.createPost(currentUser, createPost);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_POST + currentUser.id, {
            newPost: post,
        });
        return 'success';
    }

    @Subscription()
    newPost(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_POST + userId);
    }

    @Mutation()
    async addLike(@CurrentUser() currentUser: ICurrentUser, @Args('postId') postId: string) {
        const like = await this.postService.addLike(currentUser.id, postId);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.ADD_LIKE + postId, {
            newLike: like,
        });
        return 'success';
    }

    @Subscription()
    newLike(@Args('postId') postId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.ADD_LIKE + postId);
    }

    @Mutation()
    async addComment(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('createCommentInput') createCommentInput: CreateCommentInput,
    ) {
        const comment = await this.postService.addComment(currentUser.id, createCommentInput);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.ADD_COMMENT + createCommentInput.postId, {
            newComment: comment,
        });
        return 'success';
    }

    @Subscription()
    newComment(@Args('postId') postId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.ADD_COMMENT + postId);
    }

    @Mutation()
    async deletePost(@Args('postId') postId: string) {
        await this.postService.deletePost(postId);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.DELETE_POST + postId, {
            newDeletePost: 'success',
        });
        return 'success';
    }

    @Subscription()
    newDeletePost(@Args('postId') postId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.DELETE_POST + postId);
    }

    @Mutation()
    async editPost(@Args('postId') postId: string, @Args('editPost') editPost: CreatePostInput) {
        const updatePost = await this.postService.editPost(postId, editPost);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.EDIT_POST + postId, {
            newEditPost: updatePost,
        });
        return 'succeess';
    }

    @Subscription()
    newEditPost(@Args('postId') postId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.EDIT_POST + postId);
    }
}
