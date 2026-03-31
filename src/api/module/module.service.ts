import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleDbService } from 'src/repository/module.db-service';
import { CreateModuleDto, UpdateModuleDto } from './dto/create-module.dto';
import { ModuleMapDbService } from 'src/repository/moduleMap.db-service';
import { plainToInstance } from 'class-transformer';
import { ModuleResponseDto } from './response/module.type';
import { ChapterMapDbService } from 'src/repository/chapterMap.db-service';

@Injectable()
export class ModuleService {
  constructor(
    private readonly moduleDbService: ModuleDbService,
    private readonly moduleMapDbService: ModuleMapDbService,
    private readonly chapterMapDbService: ChapterMapDbService,
  ) {}

  async create(payload: CreateModuleDto, user: any) {
    const module = await this.moduleDbService.create({
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    await this.moduleMapDbService.updateMany({
      where: {
        courseVersionId: payload.courseVersionId,
        orderIndex: {
          gte: payload.orderIndex,
        },
      },
      data: {
        orderIndex: {
          increment: 1,
        },
      },
    });
    await this.moduleMapDbService.create({
      data: {
        moduleId: module.id,
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    const moduleResponse = plainToInstance(ModuleResponseDto, module);
    moduleResponse.orderIndex = payload.orderIndex;
    return {
      message: 'Module created successfully',
      data: moduleResponse,
    };
  }

  async update(payload: UpdateModuleDto, user: any) {
    const existingModule = await this.moduleMapDbService.findFirst({
      where: {
        moduleId: payload.id,
        courseVersionId: payload.courseVersionId,
      },
    });
    if (!existingModule) {
      throw new NotFoundException('Module not found');
    }
    const existingModuleCount = await this.moduleMapDbService.count({
      where: {
        moduleId: payload.id,
        courseVersionId: payload.courseVersionId,
      },
    });
    if (existingModuleCount > 1) {
      const createModule = await this.moduleDbService.create({
        data: {
          title: payload.title,
          description: payload.description,
          overview: payload.overview,
        },
      });
      await this.moduleMapDbService.update({
        where: {
          courseVersionId_moduleId: {
            moduleId: payload.id,
            courseVersionId: payload.courseVersionId,
          },
        },
        data: {
          moduleId: createModule.id,
        },
      });
      await this.chapterMapDbService.updateMany({
        where: {
          moduleId: payload.id,
          courseVersionId: payload.courseVersionId,
        },
        data: {
          moduleId: createModule.id,
        },
      });
      const moduleResponse = plainToInstance(ModuleResponseDto, createModule);
      moduleResponse.orderIndex = payload.orderIndex;
      return {
        message: 'Module created successfully',
        data: moduleResponse,
      };
    }
    const module = await this.moduleDbService.update({
      where: {
        id: payload.id,
      },
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
      },
    });
    const moduleResponse = plainToInstance(ModuleResponseDto, module);
    moduleResponse.orderIndex = payload.orderIndex;
    return {
      message: 'Module updated successfully',
      data: moduleResponse,
    };
  }
}
