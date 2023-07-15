import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number | string>('PORT');

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
}

bootstrap();
