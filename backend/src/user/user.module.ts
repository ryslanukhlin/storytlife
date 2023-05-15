import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { UniqueFieldUser } from 'src/validator/uniqueField.validator';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AppGateway } from './app.gateway';

@Module({
    imports: [FileModule],
    providers: [UserService, UserResolver, UniqueFieldUser, AppGateway],
    exports: [UserService],
})
export class UserModule {}
