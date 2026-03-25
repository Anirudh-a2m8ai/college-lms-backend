import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const corsAllowedOrigins = process.env.ALLOWED_ORIGINS?.toString().split(',') as string[];
  app.enableCors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV !== 'production' || corsAllowedOrigins.indexOf(origin as string) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('CROSS origin error'), false);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new GlobalExceptionFilter(), new PrismaExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
