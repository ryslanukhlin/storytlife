import {
    Body,
    Controller,
    Post,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthApiGuard } from 'src/auth/guard/jwt-auth-api.guard';
import { Public } from 'src/decorator/public.decorator';
import { FileService, FilesResourceEnum } from 'src/file/file.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Controller('user')
export class UserController {
    constructor(
        private readonly fileService: FileService,
        private readonly userService: UserService,
        private readonly userResolver: UserResolver,
    ) {}

    @Public()
    @Post('gallery')
    @UseGuards(JwtAuthApiGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async downloadImagesGallery(
        @Req() request,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        const fileNames = this.fileService.saveFiles(files, FilesResourceEnum.IMAGES_GALLERY);

        this.userService.addGallery(request.user.id as string, fileNames as string[]);

        this.userResolver.startSubsctibeGallery(request.user.id as string, fileNames as string[]);
    }
}
