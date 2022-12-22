import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
    imports: [FileModule],
    providers: [PostResolver, PostService],
})
export class PostModule {}
