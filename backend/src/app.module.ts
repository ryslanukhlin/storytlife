import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { ChatModule } from './chat/chat.module';
import { PubsubModule } from './pubsub/pubsub.module';
import { Context } from 'graphql-ws';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CallModule } from './call/call.module';
import jwt_decode from 'jwt-decode';

function toLowerKeys(obj) {
    // 👇️ [ ['NAME', 'Tom'], ['AGE', 30] ]
    const entries = Object.entries(obj);

    return Object.fromEntries(
        entries.map(([key, value]) => {
            return [key.toLowerCase(), value];
        }),
    );
}

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: false,
            subscriptions: {
                'graphql-ws': true,
                'subscriptions-transport-ws': {
                    onConnect: (headersRaw: Record<string, unknown>) => {
                        const headers = Object.keys(headersRaw).reduce((dest, key) => {
                            dest[key.toLowerCase()] = headersRaw[key];
                            return dest;
                        }, {});
                        return {
                            req: {
                                headers: headers,
                            },
                        };
                    },
                },
            },
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            typePaths: ['./**/*.gql'],
            definitions: {
                path: join(process.cwd(), 'src/types/graphql.ts'),
                outputAs: 'class',
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        UserModule,
        AuthModule,
        ChatModule,
        PubsubModule,
        CallModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
