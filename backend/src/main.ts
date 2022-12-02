import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new CustomValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(5000);
}
bootstrap();
