import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDbService } from 'src/repository/role.db-service';
import { CreateRoleDto } from './dto/create-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleResponseDto } from './response/role.type';
import { UpdateRoleDto } from './dto/update-role.dto';

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

    const roleResponse = plainToInstance(RoleResponseDto, role);

    return {
      message: 'Role created successfully',
      data: roleResponse,
    };
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

  async update(id: string, payload: UpdateRoleDto, user: any) {
    const isExist = await this.roleDbService.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Role not found');
    }
    const role = await this.roleDbService.update({
      where: {
        id,
      },
      data: {
        role: payload.name,
        permissions: {
          set: payload.permissions?.map((permission: string) => ({
            id: permission,
          })),
        },
      },
    });

    const roleResponse = plainToInstance(RoleResponseDto, role);

    return {
      message: 'Role updated successfully',
      data: roleResponse,
    };
  }

  async delete(id: string) {
    const isExist = await this.roleDbService.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Role not found');
    }
    const role = await this.roleDbService.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Role deleted successfully',
    };
  }
}
