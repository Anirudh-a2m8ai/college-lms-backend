import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChapterDbService } from 'src/repository/chapter.db-service';
import { ChapterMapDbService } from 'src/repository/chapterMap.db-service';
import { CreateChapterDto, UpdateChapterDto } from './dto/create-chapter.dto';
import { plainToInstance } from 'class-transformer';
import { ChapterResponseDto } from './response/chapter.type';
import { LessonMapDbService } from 'src/repository/lessonMap.db-service';
import { Chapter, ChapterMap } from 'src/generated/prisma/client';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterDbService: ChapterDbService,
    private readonly chapterMapDbService: ChapterMapDbService,
    private readonly lessonMapDbService: LessonMapDbService,
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

  async update(payload: UpdateChapterDto, user: any) {
    const existingChapter = await this.chapterMapDbService.findFirst({
      where: {
        chapterId: payload.id,
        courseVersionId: payload.courseVersionId,
      },
    });
    if (!existingChapter) {
      throw new NotFoundException('Chapter not found');
    }
    const existingChapterCount = await this.chapterMapDbService.count({
      where: {
        chapterId: payload.id,
      },
    });
    if (existingChapterCount > 1) {
      const createChapter = await this.chapterDbService.create({
        data: {
          title: payload.title,
          description: payload.description,
          overview: payload.overview,
        },
      });
      await this.chapterMapDbService.update({
        where: {
          courseVersionId_moduleId_chapterId: {
            chapterId: payload.id,
            courseVersionId: payload.courseVersionId,
            moduleId: payload.moduleId,
          },
        },
        data: {
          chapterId: createChapter.id,
        },
      });
      await this.lessonMapDbService.updateMany({
        where: {
          chapterId: payload.id,
          courseVersionId: payload.courseVersionId,
        },
        data: {
          chapterId: createChapter.id,
        },
      });
      const chapterResponse = plainToInstance(ChapterResponseDto, createChapter);
      chapterResponse.orderIndex = payload.orderIndex;
      chapterResponse.isNewlyCreated = true;
      chapterResponse.oldChapterId = payload.id;
      return {
        message: 'Chapter updated successfully',
        data: chapterResponse,
      };
    }
    const chapter = await this.chapterDbService.update({
      where: {
        id: payload.id,
      },
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    const chapterResponse = plainToInstance(ChapterResponseDto, chapter);
    chapterResponse.orderIndex = payload.orderIndex;
    chapterResponse.isNewlyCreated = false;
    return {
      message: 'Chapter updated successfully',
      data: chapterResponse,
    };
  }

  async findAllChaptersInModule(moduleId: string, courseVersionId: string) {
    const chapterMap = (await this.chapterMapDbService.findMany({
      where: {
        moduleId,
        courseVersionId,
      },
      include: {
        chapter: true,
      },
    })) as (ChapterMap & { chapter: Chapter })[];
    const chapterResponse = plainToInstance(
      ChapterResponseDto,
      chapterMap.map((item) => {
        const chapterResponse = plainToInstance(ChapterResponseDto, item.chapter);
        chapterResponse.orderIndex = item.orderIndex;
        return chapterResponse;
      }),
    );
    return {
      message: 'Chapters fetched successfully',
      data: chapterResponse,
    };
  }
}
