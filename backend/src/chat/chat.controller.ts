import {
    Body,
    Controller,
    Post,
    Req,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthApiGuard } from 'src/auth/guard/jwt-auth-api.guard';
import { Public } from 'src/decorator/public.decorator';
import { ChatDto } from './chat.dto';
import { v4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { FileService, FilesNameMessages, FilesResourceEnum } from 'src/file/file.service';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly chatReolver: ChatResolver,
        private readonly fileService: FileService,
    ) {}

    @Public()
    @Post()
    @UseGuards(JwtAuthApiGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async createMessage(
        @Req() request,
        @Body() chatBody: ChatDto,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        const fileNames = this.fileService.saveFiles(files, FilesResourceEnum.MESSAGES_FILE);

        const { message, notification } = await this.chatService.createMessage(
            request.user.id as string,
            chatBody,
            fileNames as FilesNameMessages,
        );

        this.chatReolver.messagePublishApi(message, notification, chatBody.roomId, chatBody.userId);
    }
}
