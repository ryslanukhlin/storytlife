import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { CallResolver } from './call.resolver';
import { CallService } from './call.service';

@Module({
    providers: [CallResolver, CallService],
})
export class CallModule {}
