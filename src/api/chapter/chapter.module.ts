import { Module } from '@nestjs/common';
import { DbServiceModule } from 'src/repository/db-service.module';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';

@Module({
  imports: [DbServiceModule],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
