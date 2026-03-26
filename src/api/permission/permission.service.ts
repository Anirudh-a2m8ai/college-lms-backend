import { Injectable } from '@nestjs/common';
import { PermissionDbService } from 'src/repository/permission.db-service';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionDbService: PermissionDbService) {}

  async findAll() {
    const permissions = await this.permissionDbService.findMany({
      where: {
        isDeleted: false,
      },
    });
    return permissions;
  }
}
