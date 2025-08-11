import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
    const origins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);
    app.enableCors({ origin: origins, credentials: true });
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3100'],
    credentials: true,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3001);
}
bootstrap().then((e) => console.log(e));
