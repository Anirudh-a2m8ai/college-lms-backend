import { Module } from '@nestjs/common';
import { UserDbService } from './user.db-service';
import { UserTokenDbService } from './user-token.db-service';
import { RoleDbService } from './role.db-service';
import { TenantDbService } from './tenant.db-service';
import { DesignationDbService } from './designation.db-service';
import { CourseDbService } from './course.db-service';
import { CourseVersionDbService } from './courseVersion.db-service';
import { PermissionDbService } from './permission.db-service';
import { ModuleDbService } from './module.db-service';
import { ModuleMapDbService } from './moduleMap.db-service';
import { ChapterDbService } from './chapter.db-service';
import { ChapterMapDbService } from './chapterMap.db-service';
import { LessonDbService } from './lesson.db-service';
import { LessonMapDbService } from './lessonMap.db-service';
import { TopicDbService } from './topic.db-service';
import { TopicMapDbService } from './topicMap.db-service';
import { SubTopicDbService } from './subTopic.db-service';
import { SubTopicMapDbService } from './subTopicMap.db-service';
import { QuizDbService } from './quiz.db-service';
import { QuizQuestionDbService } from './quiz-question.db-service';
import { EnrollmentsDbService } from './enrollments.db-service';
import { UserProgressDbService } from './userProgress.db-service';
import { QuizSubmissionDbService } from './quizSubmission.db-service';
import { QuizProgressDbService } from './quizProgress.db-service';
import { ClassRoomDbService } from './classRoom.db-service';
import { ClassSubTopicMapDbService } from './classSubtopicMap.db-service';
import { ClassModuleMapDbService } from './classModuleMap.db-service';
import { ClassChapterMapDbService } from './classChapterMap.db-service';
import { ClassLessonMapDbService } from './classLessonMap.db-service';
import { ClassTopicMapDbService } from './classTopicMap.db-service';
import { ClassRoomProgressDbService } from './classRoomProgress.db-service';
import { LiveClassDbService } from './liveClass.db-service';

@Module({
  providers: [
    UserDbService,
    UserTokenDbService,
    RoleDbService,
    TenantDbService,
    DesignationDbService,
    CourseDbService,
    CourseVersionDbService,
    PermissionDbService,
    ModuleDbService,
    ModuleMapDbService,
    ChapterDbService,
    ChapterMapDbService,
    LessonDbService,
    LessonMapDbService,
    TopicDbService,
    TopicMapDbService,
    SubTopicDbService,
    SubTopicMapDbService,
    QuizDbService,
    QuizQuestionDbService,
    EnrollmentsDbService,
    UserProgressDbService,
    QuizSubmissionDbService,
    QuizProgressDbService,
    ClassRoomDbService,
    ClassSubTopicMapDbService,
    ClassModuleMapDbService,
    ClassChapterMapDbService,
    ClassLessonMapDbService,
    ClassTopicMapDbService,
    ClassRoomProgressDbService,
    LiveClassDbService,
  ],
  exports: [
    UserDbService,
    UserTokenDbService,
    RoleDbService,
    TenantDbService,
    DesignationDbService,
    CourseDbService,
    CourseVersionDbService,
    PermissionDbService,
    ModuleDbService,
    ModuleMapDbService,
    ChapterDbService,
    ChapterMapDbService,
    LessonDbService,
    LessonMapDbService,
    TopicDbService,
    TopicMapDbService,
    SubTopicDbService,
    SubTopicMapDbService,
    QuizDbService,
    QuizQuestionDbService,
    EnrollmentsDbService,
    UserProgressDbService,
    QuizSubmissionDbService,
    QuizProgressDbService,
    ClassRoomDbService,
    ClassSubTopicMapDbService,
    ClassModuleMapDbService,
    ClassChapterMapDbService,
    ClassLessonMapDbService,
    ClassTopicMapDbService,
    ClassRoomProgressDbService,
    LiveClassDbService,
  ],
})
export class DbServiceModule {}
