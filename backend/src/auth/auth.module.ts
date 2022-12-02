import { AuthResolver } from './auth.resolver';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECTET,
            }),
        }),
    ],
    providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
