import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { RoleModule } from './role/role.module';
import { TenantModule } from './tenant/tenant.module';
import { DesignationModule } from './designation/designation.module';
import { CourseModule } from './course/course.module';
import { PermissionModule } from './permission/permission.module';
import { ModuleModule } from './module/module.module';
import { ChapterModule } from './chapter/chapter.module';
import { LessonModule } from './lesson/lesson.module';
import { TopicModule } from './topic/topic.module';
import { SubTopicModule } from './subTopic/subTopic.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { QuizModule } from './quiz/quiz.module';
import { UserProgressModule } from './userProgress/userProgress.module';
import { QuizProgressModule } from './quizProgress/quizProgress.module';
import { ClassRoomModule } from './classRoom/classRoom.module';
import { LiveClassModule } from './liveClass/liveClass.module';
import { ClassRoomProgressModule } from './classRoomProgress/classRoomProgress.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    TenantModule,
    DesignationModule,
    CourseModule,
    PermissionModule,
    ModuleModule,
    ChapterModule,
    LessonModule,
    TopicModule,
    SubTopicModule,
    EnrollmentsModule,
    QuizModule,
    UserProgressModule,
    QuizProgressModule,
    ClassRoomModule,
    LiveClassModule,
    ClassRoomProgressModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class ApiModule {}
