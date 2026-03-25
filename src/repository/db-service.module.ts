import { Module } from '@nestjs/common';
import { UserDbService } from './user.db-service';
import { UserTokenDbService } from './user-token.db-service';
import { RoleDbService } from './role.db-service';
import { TenantDbService } from './tenant.db-service';
import { DesignationDbService } from './designation.db-service';
import { CourseDbService } from './course.db-service';

@Module({
  providers: [UserDbService, UserTokenDbService, RoleDbService, TenantDbService, DesignationDbService, CourseDbService],
  exports: [UserDbService, UserTokenDbService, RoleDbService, TenantDbService, DesignationDbService, CourseDbService],
})
export class DbServiceModule {}
