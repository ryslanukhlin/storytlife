import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/validation.pipe';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: { origin: 'http://localhost:3000' } });
    app.useGlobalPipes(new CustomValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(bodyParser.json({ limit: '150mb' }));
    app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
    await app.listen(5000);
}
bootstrap();
