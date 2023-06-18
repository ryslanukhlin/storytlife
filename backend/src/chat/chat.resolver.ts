import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/user/currentUser.decorator';
import { ChatService } from './chat.service';
import {
    AcceptCall,
    AcceptCallInput,
    CreateCallInput,
    CreateCallResult,
    DeleteInputNotification,
    MessageInput,
} from './../types/graphql';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Message, MessageNotification } from '@prisma/client';

enum SUBSCRIPTIONS_EVENT {
    NEW_ROOM = 'NEW_ROOM',
    NEW_MESSAGE = 'NEW_MESSAGE',
    NEW_CALL = 'NEW_CALL',
    ACCEPT_CALL = 'ACCEPT_CALL',
    CANCEL_CALL = 'CANCEL_CALL',
    NEW_NOTIFICATION = 'NEW_NOTIFICATION',
}

@Resolver()
export class ChatResolver {
    constructor(
        private readonly chatService: ChatService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) {}

    @Query()
    getMessages(@Args('roomId') roomId: string) {
        return this.chatService.getMessages(roomId);
    }

    @Mutation()
    async createRoom(@CurrentUser() currentUser: ICurrentUser, @Args('userId') userId: string) {
        const room = await this.chatService.createRoom(currentUser.id, userId);
        const usersFrend = room.users.filter((user) => user.id !== currentUser.id);
        const usersCurrent = room.users.filter((user) => user.id !== userId);

        const frendRoom = { ...room };
        const currentRoom = { ...room };

        frendRoom.users = usersFrend;
        currentRoom.users = usersCurrent;

        this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_ROOM + userId, {
            newCreateRoom: currentRoom,
        });
        return frendRoom;
    }

    @Subscription()
    newCreateRoom(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_ROOM + userId);
    }

    @Mutation()
    async createMessage(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('messageInput') messageInput: MessageInput,
    ) {
        try {
            const { message, notification } = await this.chatService.createMessage(
                currentUser.id,
                messageInput,
            );
            this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_MESSAGE + messageInput.roomId, {
                newMessage: message,
            });
            this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_NOTIFICATION + messageInput.userId, {
                newNotification: notification,
            });
            return 'success';
        } catch (e) {
            return 'error';
        }
    }

    messagePublishApi(
        message: Message,
        notification: MessageNotification,
        chadId: string,
        userId: string,
    ) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_MESSAGE + chadId, {
            newMessage: message,
        });
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_NOTIFICATION + userId, {
            newNotification: notification,
        });
    }

    @Subscription()
    newMessage(@Args('roomId') roomId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_MESSAGE + roomId);
    }

    @Subscription()
    newNotification(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_NOTIFICATION + userId);
    }

    @Mutation()
    async createCall(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('createCallInput') createCallInput: CreateCallInput,
    ) {
        const { userId, ...result } = createCallInput;
        const on_call = await this.chatService.checkIsCalledUser(createCallInput.userId);
        if (on_call) {
            return CreateCallResult.REJECTED;
        }
        await this.chatService.changeStatusCalledUser(currentUser.id, userId, true);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_CALL + userId, {
            newCreteCall: result,
        });
        return CreateCallResult.SUCCESS;
    }

    @Subscription()
    newCreteCall(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_CALL + userId);
    }

    @Mutation()
    async acceptCall(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('acceptCallInput') acceptCallInput: AcceptCallInput,
    ) {
        const { userId, ...result } = acceptCallInput;
        if (acceptCallInput.acceptCall === AcceptCall.Deny)
            await this.chatService.changeStatusCalledUser(currentUser.id, userId, false);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.ACCEPT_CALL + userId, {
            newAcceptCall: result,
        });
        return 'success';
    }

    @Subscription()
    newAcceptCall(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.ACCEPT_CALL + userId);
    }

    @Mutation()
    async cancelCall(@CurrentUser() currentUser: ICurrentUser, @Args('userId') userId: string) {
        await this.chatService.changeStatusCalledUser(currentUser.id, userId, false);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.CANCEL_CALL + userId, {
            newCancelCall: userId,
        });
        return 'success';
    }

    @Subscription()
    newCancelCall(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.CANCEL_CALL + userId);
    }

    @Mutation()
    async deleteNotification(
        @Args('deleteInputNotification') deleteInput: DeleteInputNotification,
    ) {
        try {
            await this.chatService.deleteNotification(deleteInput);
            return 'success';
        } catch (e) {
            return 'error';
        }
    }
}
