import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TopicMapDbService } from 'src/repository/topicMap.db-service';
import { TopicDbService } from 'src/repository/topic.db-service';
import { CreateTopicDto, UpdateTopicDto } from './dto/create-topic.dto';
import { TopicResponseDto } from './response/topic.type';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicDbService: TopicDbService,
    private readonly topicMapDbService: TopicMapDbService,
  ) {}

  async create(payload: CreateTopicDto, user: any) {
    const existingTopicIndex = await this.topicMapDbService.findFirst({
      where: {
        lessonId: payload.lessonId,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    if (existingTopicIndex) {
      throw new BadRequestException('Topic index already exists');
    }
    const topic = await this.topicDbService.create({
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    await this.topicMapDbService.create({
      data: {
        topicId: topic.id,
        lessonId: payload.lessonId,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    const topicResponse = plainToInstance(TopicResponseDto, topic);
    topicResponse.orderIndex = payload.orderIndex;
    topicResponse.lessonId = payload.lessonId;
    return {
      message: 'Topic created successfully',
      data: topicResponse,
    };
  }

  async update(payload: UpdateTopicDto, user: any) {
    const existingTopic = await this.topicMapDbService.findFirst({
      where: {
        topicId: payload.id,
        courseVersionId: payload.courseVersionId,
      },
    });
    if (!existingTopic) {
      throw new NotFoundException('Topic not found');
    }
    const existingTopicCount = await this.topicMapDbService.count({
      where: {
        topicId: payload.id,
      },
    });
    if (existingTopicCount > 1) {
      const createTopic = await this.topicDbService.create({
        data: {
          title: payload.title,
          description: payload.description,
          overview: payload.overview,
        },
      });
      await this.topicMapDbService.update({
        where: {
          courseVersionId_lessonId_topicId: {
            topicId: payload.id,
            courseVersionId: payload.courseVersionId,
            lessonId: payload.lessonId,
          },
        },
        data: {
          topicId: createTopic.id,
        },
      });
      const topicResponse = plainToInstance(TopicResponseDto, createTopic);
      topicResponse.orderIndex = payload.orderIndex;
      topicResponse.lessonId = payload.lessonId;
      return {
        message: 'Topic updated successfully',
        data: topicResponse,
      };
    }
    const topic = await this.topicDbService.update({
      where: {
        id: payload.id,
      },
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    const topicResponse = plainToInstance(TopicResponseDto, topic);
    topicResponse.orderIndex = payload.orderIndex;
    topicResponse.lessonId = payload.lessonId;
    return {
      message: 'Topic updated successfully',
      data: topicResponse,
    };
  }
}
