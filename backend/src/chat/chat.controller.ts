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

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly chatReolver: ChatResolver,
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
        const fileNames = [];
        files.forEach((file) => {
            const fileExpansion = file.originalname.split('.').pop();

            const fileName = v4() + '.' + fileExpansion;

            const filePath = path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                'frontend',
                'public',
                'messages_file',
            );

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

            fileNames.push({ basicName: file.originalname, generateName: fileName });
        });

        const { message, notification } = await this.chatService.createMessage(
            request.user.id as string,
            chatBody,
            fileNames,
        );

        this.chatReolver.messagePublishApi(message, notification, chatBody.roomId, chatBody.userId);
    }
}
