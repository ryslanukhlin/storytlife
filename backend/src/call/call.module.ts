import { Module } from '@nestjs/common';
import { CallResolver } from './call.resolver';

@Module({
    providers: [CallResolver],
})
export class CallModule {}
