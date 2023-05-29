import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
    providers: [ChatService, ChatResolver],
    controllers: [ChatController],
})
export class ChatModule {}
