import { Module, Global } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
    providers: [
        {
            provide: PUB_SUB,
            useValue: new RedisPubSub({
                connection: {
                    port: 6379,
                },
            }),
        },
    ],
    exports: [PUB_SUB],
})
export class PubsubModule {}
