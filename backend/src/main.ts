import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/validation.pipe';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new CustomValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
    await app.listen(5000);
}
bootstrap();
