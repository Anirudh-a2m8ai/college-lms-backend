import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleDbService } from 'src/repository/module.db-service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleMapDbService } from 'src/repository/moduleMap.db-service';
import { plainToInstance } from 'class-transformer';
import { ModuleResponseDto } from './response/module.type';

@Injectable()
export class ModuleService {
  constructor(
    private readonly moduleDbService: ModuleDbService,
    private readonly moduleMapDbService: ModuleMapDbService,
  ) {}

  async create(payload: CreateModuleDto, user: any) {
    const existingModuleIndex = await this.moduleMapDbService.findFirst({
      where: {
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
      },
    });
    if (existingModuleIndex) {
      throw new BadRequestException('Module index already exists');
    }
    const module = await this.moduleDbService.create({
      data: {
        title: payload.title,
        description: payload.description,
        overview: payload.overview,
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
}
