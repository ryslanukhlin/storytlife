import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { CreateCandidateInput, CreateOfferInput } from 'src/types/graphql';
import { CurrentUser, ICurrentUser } from 'src/user/currentUser.decorator';
import { CallService } from './call.service';

enum SUBSCRIPTIONS_EVENT {
    CREATE_OFFER = 'CREATE_OFFER',
    CREATE_CANDIDATE = 'CREATE_CANDIDATE',
    ANSWE_ON_CALLPAGE = 'ANSWE_ON_CALLPAGE',
    LEAVE_CALL = 'LEAVE_CALL',
    CHANGE_VIDEO = 'CHANGE_VIDEO',
    CHANGE_AUDIO = 'CHANGE_AUDIO',
}

@Resolver()
export class CallResolver {
    constructor(
        private readonly callService: CallService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    ) {}

    @Mutation()
    createOffer(@Args('createOfferInput') createOfferInput: CreateOfferInput) {
        const { userId, ...result } = createOfferInput;
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.CREATE_OFFER + userId, {
            newCreateOffer: result,
        });
        return 'success';
    }

    @Subscription()
    newCreateOffer(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.CREATE_OFFER + userId);
    }

    @Mutation()
    createCandidate(@Args('createCandidateInput') createCandidateInput: CreateCandidateInput) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.CREATE_CANDIDATE + createCandidateInput.userId, {
            newCreateOffer: createCandidateInput.candidate,
        });
        return 'success';
    }

    @Subscription()
    newCreateCandidate(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.CREATE_CANDIDATE + userId);
    }

    @Mutation()
    answerOnCallPage(@Args('userId') userId: string) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.ANSWE_ON_CALLPAGE + userId, {
            newAnswerOnCallPage: userId,
        });
        return 'success';
    }

    @Subscription()
    newAnswerOnCallPage(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.ANSWE_ON_CALLPAGE + userId);
    }

    @Mutation()
    async leaveCall(@CurrentUser() currentUser: ICurrentUser, @Args('userId') userId: string) {
        await this.callService.removeCallStatusUsers(currentUser.id, userId);
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.LEAVE_CALL + userId, {
            newLeaveCall: userId,
        });
        return 'success';
    }

    @Subscription()
    newLeaveCall(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.LEAVE_CALL + userId);
    }

    @Mutation()
    async changeVideo(@Args('userId') userId: string) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.CHANGE_VIDEO + userId, {
            newChangeVideo: userId,
        });
        return 'success';
    }

    @Subscription()
    newChangeVideo(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.CHANGE_VIDEO + userId);
    }

    @Mutation()
    async changeAudio(@Args('userId') userId: string) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.CHANGE_AUDIO + userId, {
            newChangeAudio: userId,
        });
        return 'success';
    }

    @Subscription()
    newChangeAudio(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.CHANGE_AUDIO + userId);
    }
}
