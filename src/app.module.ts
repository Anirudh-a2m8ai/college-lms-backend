import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/configService.config';
import { PrismaModule } from './prisma/prisma.module';
import { DbServiceModule } from './repository/db-service.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get('redis.password'),
        },
      }),
    }),
    QueueModule,
    PrismaModule,
    ApiModule,
    DbServiceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
