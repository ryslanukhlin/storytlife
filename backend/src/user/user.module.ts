import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { UniqueFieldUser } from 'src/validator/uniqueField.validator';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [FileModule],
    providers: [UserService, UserResolver, UniqueFieldUser],
    exports: [UserService],
})
export class UserModule {}
