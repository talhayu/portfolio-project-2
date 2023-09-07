import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { TokenRevocationMiddleware } from './auth/tokenrevoke/token-revocation.middleware';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // app.use(passport.initialize());

  // Add TokenRevocationMiddleware before other middleware and routes


  await app.listen(4000);
}
bootstrap();
