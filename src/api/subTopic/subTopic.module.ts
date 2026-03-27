import { Module } from '@nestjs/common';
import { DbServiceModule } from 'src/repository/db-service.module';
import { SubTopicController } from './subTopic.controller';
import { SubTopicService } from './subTopic.service';

@Module({
  imports: [DbServiceModule],
  controllers: [SubTopicController],
  providers: [SubTopicService],
})
export class SubTopicModule {}
