import { Module } from '@nestjs/common';
import { DbServiceModule } from 'src/repository/db-service.module';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [DbServiceModule],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
