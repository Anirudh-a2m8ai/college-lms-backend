import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateLessonDto, UpdateLessonDto } from './dto/create-lesson.dto';
import { LessonDbService } from 'src/repository/lesson.db-service';
import { LessonMapDbService } from 'src/repository/lessonMap.db-service';
import { LessonResponseDto } from './response/lesson.type';
import { TopicMapDbService } from 'src/repository/topicMap.db-service';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonDbService: LessonDbService,
    private readonly lessonMapDbService: LessonMapDbService,
    private readonly topicMapDbService: TopicMapDbService,
  ) {}

  async create(payload: CreateLessonDto, user: any) {
    const existingLessonIndex = await this.lessonMapDbService.findFirst({
      where: {
        chapterId: payload.chapterId,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    if (existingLessonIndex) {
      throw new BadRequestException('Lesson index already exists');
    }
    const lesson = await this.lessonDbService.create({
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    await this.lessonMapDbService.create({
      data: {
        lessonId: lesson.id,
        chapterId: payload.chapterId,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    const lessonResponse = plainToInstance(LessonResponseDto, lesson);
    lessonResponse.orderIndex = payload.orderIndex;
    lessonResponse.chapterId = payload.chapterId;
    lessonResponse.moduleId = payload.moduleId;
    return {
      message: 'Lesson created successfully',
      data: lessonResponse,
    };
  }

  async update(payload: UpdateLessonDto, user: any) {
    const existingLesson = await this.lessonMapDbService.findFirst({
      where: {
        lessonId: payload.id,
        courseVersionId: payload.courseVersionId,
      },
    });
    if (!existingLesson) {
      throw new NotFoundException('Lesson not found');
    }
    const existingLessonCount = await this.lessonMapDbService.count({
      where: {
        lessonId: payload.id,
      },
    });
    if (existingLessonCount > 1) {
      const createLesson = await this.lessonDbService.create({
        data: {
          title: payload.title,
          description: payload.description,
          overview: payload.overview,
        },
      });
      await this.lessonMapDbService.update({
        where: {
          courseVersionId_chapterId_lessonId: {
            lessonId: payload.id,
            courseVersionId: payload.courseVersionId,
            chapterId: existingLesson.chapterId,
          },
        },
        data: {
          lessonId: createLesson.id,
        },
      });
      await this.topicMapDbService.updateMany({
        where: {
          lessonId: payload.id,
          courseVersionId: payload.courseVersionId,
        },
        data: {
          lessonId: createLesson.id,
        },
      });
      const lessonResponse = plainToInstance(LessonResponseDto, createLesson);
      lessonResponse.orderIndex = payload.orderIndex;
      lessonResponse.isNewlyCreated = true;
      lessonResponse.oldLessonId = payload.id;
      return {
        message: 'Chapter updated successfully',
        data: lessonResponse,
      };
    }
    const module = await this.lessonDbService.update({
      where: {
        id: payload.id,
      },
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    const lessonResponse = plainToInstance(LessonResponseDto, module);
    lessonResponse.orderIndex = payload.orderIndex;
    lessonResponse.isNewlyCreated = false;
    return {
      message: 'Chapter updated successfully',
      data: lessonResponse,
    };
  }
}
