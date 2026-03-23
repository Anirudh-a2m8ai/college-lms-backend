import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
