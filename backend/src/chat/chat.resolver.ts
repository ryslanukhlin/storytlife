import { Args, Mutation, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/user/currentUser.decorator';
import { ChatService } from './chat.service';
import { MessageInput } from './../types/graphql';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { Public } from 'src/decorator/public.decorator';

enum SUBSCRIPTIONS_EVENT {
    newMessage = 'newMessage',
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
            this.pubSub.publish(SUBSCRIPTIONS_EVENT.newMessage + messageInput.roomId, {
                newMessage: message,
            });
            return 'success';
        } catch (e) {
            console.log(e);

            return 'error';
        }
    }

    @Subscription()
    newMessage(@Args('roomId') roomId: string) {
        console.log(roomId);

        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.newMessage + roomId);
    }
}
