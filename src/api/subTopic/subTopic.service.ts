import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SubTopicDbService } from 'src/repository/subTopic.db-service';
import { SubTopicMapDbService } from 'src/repository/subTopicMap.db-service';
import { plainToInstance } from 'class-transformer';
import { SubTopicResponseDto } from './response/subTopic.type';
import { subTopicMap, SubTopics } from 'src/generated/prisma/client';
import { ConfirmUploadDto, CreateSubTopicDto, GetUploadUrlDto, UpdateSubTopicDto } from './dto/create-subTopic.dto';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class SubTopicService {
  constructor(
    private readonly subTopicDbService: SubTopicDbService,
    private readonly subTopicMapDbService: SubTopicMapDbService,
    private readonly awsService: AwsService,
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

  async update(payload: UpdateSubTopicDto, user: any) {
    const existingSubTopic = await this.subTopicMapDbService.findFirst({
      where: {
        subTopicId: payload.id,
        courseVersionId: payload.courseVersionId,
      },
    });
    if (!existingSubTopic) {
      throw new NotFoundException('Sub topic not found');
    }
    const existingSubTopicCount = await this.subTopicMapDbService.count({
      where: {
        subTopicId: payload.id,
      },
    });
    if (existingSubTopicCount > 1) {
      const createSubTopic = await this.subTopicDbService.create({
        data: {
          title: payload.title,
        },
      });
      await this.subTopicMapDbService.update({
        where: {
          courseVersionId_topicId_subTopicId: {
            subTopicId: payload.id,
            courseVersionId: payload.courseVersionId,
            topicId: payload.topicId,
          },
        },
        data: {
          subTopicId: createSubTopic.id,
        },
      });
      const subTopicResponse = plainToInstance(SubTopicResponseDto, createSubTopic);
      subTopicResponse.orderIndex = payload.orderIndex;
      subTopicResponse.topicId = payload.topicId;
      subTopicResponse.isNewlyCreated = true;
      subTopicResponse.oldSubTopicId = payload.id;
      return {
        message: 'Sub topic updated successfully',
        data: subTopicResponse,
      };
    }
    const subTopic = await this.subTopicDbService.update({
      where: {
        id: payload.id,
      },
      data: {
        title: payload.title,
      },
    });
    const subTopicResponse = plainToInstance(SubTopicResponseDto, subTopic);
    subTopicResponse.orderIndex = payload.orderIndex;
    subTopicResponse.topicId = payload.topicId;
    subTopicResponse.isNewlyCreated = false;
    return {
      message: 'Sub topic updated successfully',
      data: subTopicResponse,
    };
  }

  async findAllSubTopicsInTopic(topicId: string, courseVersionId: string) {
    const subTopicMap = (await this.subTopicMapDbService.findMany({
      where: {
        topicId,
        courseVersionId,
      },
      include: {
        subTopic: true,
      },
    })) as (subTopicMap & { subTopic: SubTopics })[];
    const subTopicResponse = plainToInstance(
      SubTopicResponseDto,
      subTopicMap.map((item) => {
        const subTopicResponse = plainToInstance(SubTopicResponseDto, item.subTopic);
        subTopicResponse.orderIndex = item.orderIndex;
        subTopicResponse.topicId = item.topicId;
        return subTopicResponse;
      }),
    );
    return {
      message: 'Sub topics fetched successfully',
      data: subTopicResponse,
    };
  }

  async getUploadUrl(getUploadUrlDto: GetUploadUrlDto, user: any) {
    const { contentType, fileName } = getUploadUrlDto;
    console.log(user);
    const fileKey = `videos/5ce83f02-820d-4c2e-999f-9065322497ea-${Date.now()}-${fileName}`;
    const uploadUrl = await this.awsService.getPresignedUrl(fileKey, contentType);
    return {
      message: 'Upload URL fetched successfully',
      data: {
        uploadUrl,
        fileKey,
      },
    };
  }

  async confirmUpload(payload: ConfirmUploadDto) {
    const subTopic = await this.subTopicDbService.update({
      where: {
        id: payload.subTopicId,
      },
      data: {
        videoUrl: payload.fileKey,
      },
    });
    const subTopicResponse = plainToInstance(SubTopicResponseDto, subTopic);
    return {
      message: 'Sub topic video uploaded successfully',
      data: subTopicResponse,
    };
  }

  async getObjectUrl(fileKey: string) {
    const url = await this.awsService.getObjectUrl(fileKey);
    return {
      message: 'Object URL fetched successfully',
      data: url,
    };
  }
}
