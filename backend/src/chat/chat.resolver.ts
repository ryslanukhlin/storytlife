import { Args, Mutation, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/user/currentUser.decorator';
import { ChatService } from './chat.service';
import {
    AcceptCall,
    AcceptCallInput,
    AcceptCallType,
    CreateCallInput,
    MessageInput,
} from './../types/graphql';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Public } from 'src/decorator/public.decorator';

enum SUBSCRIPTIONS_EVENT {
    NEW_MESSAGE = 'NEW_MESSAGE',
    NEW_CALL = 'NEW_CALL',
    ACCEPT_CALL = 'ACCEPT_CALL',
    CANCEL_CALL = 'CANCEL_CALL',
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
    createRoom(@CurrentUser() currentUser: ICurrentUser, @Args('userId') userId: string) {
        return this.chatService.createRoom(currentUser.id, userId);
    }

    @Mutation()
    async createMessage(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('messageInput') messageInput: MessageInput,
    ) {
        try {
            const message = await this.chatService.createMessage(currentUser, messageInput);
            this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_MESSAGE + messageInput.roomId, {
                newMessage: message,
            });
            return 'success';
        } catch (e) {
            return 'error';
        }
    }

    @Subscription()
    newMessage(@Args('roomId') roomId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_MESSAGE + roomId);
    }

    @Mutation()
    createCall(@Args('createCallInput') createCallInput: CreateCallInput) {
        const { userId, ...result } = createCallInput;
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.NEW_CALL + userId, {
            newCreteCall: result,
        });
        return 'success';
    }

    @Subscription()
    newCreteCall(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.NEW_CALL + userId);
    }

    @Mutation()
    acceptCall(@Args('acceptCallInput') acceptCallInput: AcceptCallInput) {
        const { userId, ...result } = acceptCallInput;
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
    cancelCall(@Args('userId') userId: string) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.CANCEL_CALL + userId, {
            newCancelCall: userId,
        });
        return 'success';
    }

    @Subscription()
    newCancelCall(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.CANCEL_CALL + userId);
    }
}
