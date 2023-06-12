import { UserService } from './user.service';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from './currentUser.decorator';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Inject } from '@nestjs/common';
import { EditUserInput } from 'src/types/graphql';

enum SUBSCRIPTIONS_EVENT {
    NEW_AVATAR = 'NEW_AVATAR',
    NEW_BG = 'NEW_BG',
    CHANGE_ONLINE = 'CHANGE_ONLINE',
    EDIT_USER = 'EDIT_USER',
    NEW_GALLERY = 'NEW_GALLERY',
    DELETE_IMG_GALLERY = 'DELETE_IMG_GALLERY',
}

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) {}

    @Query()
    getCurrentUser(@CurrentUser() currentUser: ICurrentUser) {
        return this.userService.findId(currentUser.id);
    }

    @Query()
    getUser(@Args('userId') userId: string) {
        return this.userService.findId(userId);
    }

    @Query()
    getUsers(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('search') search: string | null,
        @Args('paginIter') paginIter: number = 0,
    ) {
        return this.userService.getUsers(currentUser.id, search, paginIter);
    }

    @Mutation()
    async setAvatar(@CurrentUser() currentUser: ICurrentUser, @Args('avatar') avatar: string) {
        try {
            const fileName = await this.userService.setAvatar(currentUser.id, avatar);
            this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_AVATAR + currentUser.id, {
                newAvatar: fileName,
            });
            return 'success';
        } catch {
            return 'error';
        }
    }

    @Subscription()
    newAvatar(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_AVATAR + userId);
    }

    @Mutation()
    async setBg(@CurrentUser() currentUser: ICurrentUser, @Args('bg') bg: string) {
        try {
            const fileName = await this.userService.setBg(currentUser.id, bg);
            this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_BG + currentUser.id, {
                newBg: fileName,
            });
            return 'success';
        } catch {
            return 'error';
        }
    }

    @Subscription()
    newBg(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_BG + userId);
    }

    @Mutation()
    async editUser(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('editUser') editUser: EditUserInput,
    ) {
        const updateUser = await this.userService.editUser(currentUser.id, editUser);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.EDIT_USER + currentUser.id, {
            newEditUser: updateUser,
        });
        return 'success';
    }

    @Subscription()
    newEditUser(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.EDIT_USER + userId);
    }

    startSubsctibeGallery(userId: string, filesName: string[]) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_GALLERY + userId, {
            newGallery: filesName,
        });
    }

    @Subscription()
    newGallery(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_GALLERY + userId);
    }

    @Mutation()
    async deleteImgGallery(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('imgName') imgName: string,
    ) {
        await this.userService.deleteGallery(currentUser.id, imgName);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.DELETE_IMG_GALLERY + currentUser.id, {
            newDeleteGallery: imgName,
        });
        return 'success';
    }

    @Subscription()
    newDeleteGallery(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.DELETE_IMG_GALLERY + userId);
    }
}
