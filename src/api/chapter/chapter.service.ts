import { BadRequestException, Injectable } from '@nestjs/common';
import { ChapterDbService } from 'src/repository/chapter.db-service';
import { ChapterMapDbService } from 'src/repository/chapterMap.db-service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { plainToInstance } from 'class-transformer';
import { ChapterResponseDto } from './response/chapter.type';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterDbService: ChapterDbService,
    private readonly chapterMapDbService: ChapterMapDbService,
  ) {}

  async create(payload: CreateChapterDto, user: any) {
    const existingChapterIndex = await this.chapterMapDbService.findFirst({
      where: {
        moduleId: payload.moduleId,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    if (existingChapterIndex) {
      throw new BadRequestException('Chapter index already exists');
    }
    const chapter = await this.chapterDbService.create({
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    await this.chapterMapDbService.create({
      data: {
        chapterId: chapter.id,
        courseVersionId: payload.courseVersionId,
        moduleId: payload.moduleId,
        orderIndex: payload.orderIndex,
      },
    });
    const chapterResponse = plainToInstance(ChapterResponseDto, chapter);
    chapterResponse.orderIndex = payload.orderIndex;
    chapterResponse.moduleId = payload.moduleId;
    return {
      message: 'Chapter created successfully',
      data: chapterResponse,
    };
  }
}
