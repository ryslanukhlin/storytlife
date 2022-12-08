import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { CreateCandidateInput, CreateOfferInput } from 'src/types/graphql';

enum SUBSCRIPTIONS_EVENT {
    CREATE_OFFER = 'CREATE_OFFER',
    CREATE_CANDIDATE = 'CREATE_CANDIDATE',
    ANSWE_ON_CALLPAGE = 'ANSWE_ON_CALLPAGE',
    LEAVE_CALL = 'LEAVE_CALL',
}

@Resolver()
export class CallResolver {
    constructor(@Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

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
    leaveCall(@Args('userId') userId: string) {
        this.pubSub.publish(SUBSCRIPTIONS_EVENT.LEAVE_CALL + userId, {
            newLeaveCall: userId,
        });
        return 'success';
    }

    @Subscription()
    newLeaveCall(@Args('userId') userId: string) {
        return this.pubSub.asyncIterator(SUBSCRIPTIONS_EVENT.LEAVE_CALL + userId);
    }
}
