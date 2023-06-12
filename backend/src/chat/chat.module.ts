import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { FileModule } from 'src/file/file.module';

@Module({
    imports: [FileModule],
    providers: [ChatService, ChatResolver],
    controllers: [ChatController],
})
export class ChatModule {}
