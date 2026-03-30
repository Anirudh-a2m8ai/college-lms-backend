import { BadRequestException, Injectable } from '@nestjs/common';
import { SubTopicDbService } from 'src/repository/subTopic.db-service';
import { SubTopicMapDbService } from 'src/repository/subTopicMap.db-service';
import { plainToInstance } from 'class-transformer';
import { SubTopicResponseDto } from './response/subTopic.type';
import { CreateSubTopicDto } from './dto/create-subTopic.dto';

@Injectable()
export class SubTopicService {
  constructor(
    private readonly subTopicDbService: SubTopicDbService,
    private readonly subTopicMapDbService: SubTopicMapDbService,
  ) {}

  async create(payload: CreateSubTopicDto, user: any) {
    const existingSubTopicIndex = await this.subTopicMapDbService.findFirst({
      where: {
        topicId: payload.topicId,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    if (existingSubTopicIndex) {
      throw new BadRequestException('Sub topic index already exists');
    }
    const subTopic = await this.subTopicDbService.create({
      data: {
        title: payload.title,
      },
    });
    await this.subTopicMapDbService.create({
      data: {
        subTopicId: subTopic.id,
        topicId: payload.topicId,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    const subTopicResponse = plainToInstance(SubTopicResponseDto, subTopic);
    subTopicResponse.orderIndex = payload.orderIndex;
    subTopicResponse.topicId = payload.topicId;
    return {
      message: 'Sub topic created successfully',
      data: subTopicResponse,
    };
  }
}
