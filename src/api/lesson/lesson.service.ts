import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonDbService } from 'src/repository/lesson.db-service';
import { LessonMapDbService } from 'src/repository/lessonMap.db-service';
import { LessonResponseDto } from './response/lesson.type';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonDbService: LessonDbService,
    private readonly lessonMapDbService: LessonMapDbService,
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
}
