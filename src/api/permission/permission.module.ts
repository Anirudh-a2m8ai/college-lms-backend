import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
