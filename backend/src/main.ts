import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT') || 5542;

  app.enableCors({
    origin: configService.get<string>('CLIENT_URL'),
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
