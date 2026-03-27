import { Module } from '@nestjs/common';

import { DbServiceModule } from 'src/repository/db-service.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [DbServiceModule],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
