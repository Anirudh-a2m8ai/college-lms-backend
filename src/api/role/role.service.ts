import { Injectable } from '@nestjs/common';
import { RoleDbService } from 'src/repository/role.db-service';
import { CreateRoleDto } from './dto/create-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleResponseDto } from './response/role.type';

@Injectable()
export class RoleService {
  constructor(private readonly roleDbService: RoleDbService) {}

  async create(payload: CreateRoleDto) {
    const role = await this.roleDbService.create({
      data: {
        role: payload.name,
        permissions: {
          connect: payload.permissions.map((permission: string) => ({
            id: permission,
          })),
        },
        isSystemDefined: false,
        isActive: true,
      },
    });

    return plainToInstance(RoleResponseDto, role);
  }

  async findAll() {
    const roles = await this.roleDbService.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        permissions: true,
      },
    });

    return plainToInstance(RoleResponseDto, roles);
  }
}
