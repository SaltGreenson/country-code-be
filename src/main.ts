import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const PORT = config.getOrThrow<number>('PORT');
  const CLIENT_URL = config.getOrThrow<number>('CLIENT_URL');

  helmet();

  app.enableCors({
    origin: CLIENT_URL,
    methods: ['GET'],
  });

  app.setGlobalPrefix('/api');
  await app.listen(PORT);
}

void bootstrap();
