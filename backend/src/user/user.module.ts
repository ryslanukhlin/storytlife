import { Module } from '@nestjs/common';
import { UniqueFieldUser } from 'src/validator/uniqueField.validator';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    providers: [UserService, UserResolver, UniqueFieldUser],
    exports: [UserService],
})
export class UserModule {}
