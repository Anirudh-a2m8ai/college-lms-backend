-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('USER', 'INSTRUCTOR', 'TENANT_ADMIN', 'GLOBAL_ADMIN');

-- CreateEnum
CREATE TYPE "SocialType" AS ENUM ('Facebook', 'LinkedIn', 'X', 'Instagram', 'Github', 'Tiktok', 'Snapchat');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('REFRESH', 'EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "ChapterMap" (
    "id" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "chapterId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,

    CONSTRAINT "ChapterMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "logicalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseVersion" (
    "id" TEXT NOT NULL,
    "versionName" TEXT NOT NULL,
    "sourceVersionId" TEXT NOT NULL,
    "status" "CourseStatus" NOT NULL,
    "lessonCount" INTEGER NOT NULL,
    "quizCount" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "isModified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "CourseVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "designationId" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "courseCode" TEXT NOT NULL,
    "latestCourseVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Designation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,
    "totalLessons" INTEGER NOT NULL,
    "totalQuizzes" INTEGER NOT NULL,
    "completedLessons" INTEGER NOT NULL,
    "completedQuizzes" INTEGER NOT NULL,
    "LastAccessedSubTopicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessonMap" (
    "id" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "lessonId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,

    CONSTRAINT "lessonMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "logicalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleMap" (
    "id" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,

    CONSTRAINT "ModuleMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "logicalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTopics" (
    "id" TEXT NOT NULL,
    "logicalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "examples" JSONB,
    "image" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "SubTopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subTopicMap" (
    "id" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "subTopicId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,

    CONSTRAINT "subTopicMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "ownerId" TEXT NOT NULL,
    "defaultLanguage" TEXT,
    "timezone" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "totalUsers" INTEGER NOT NULL,
    "coursesCreated" INTEGER NOT NULL,
    "hMac" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicMap" (
    "id" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "topicId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,

    CONSTRAINT "TopicMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topics" (
    "id" TEXT NOT NULL,
    "logicalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "tenantId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "username" TEXT,
    "profilePicture" TEXT,
    "passwordHash" TEXT NOT NULL,
    "isPasswordChanged" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "status" "AccountStatus" NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'USER',
    "permissions" JSONB,
    "bio" TEXT NOT NULL,
    "timezone" TIMESTAMP(3),
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLinks" (
    "id" TEXT NOT NULL,
    "socialType" "SocialType" NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapterMap_courseVersionId_moduleId_chapterId_key" ON "ChapterMap"("courseVersionId", "moduleId", "chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseCode_key" ON "Course"("courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "lessonMap_courseVersionId_chapterId_lessonId_key" ON "lessonMap"("courseVersionId", "chapterId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleMap_courseVersionId_moduleId_key" ON "ModuleMap"("courseVersionId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "subTopicMap_courseVersionId_topicId_subTopicId_key" ON "subTopicMap"("courseVersionId", "topicId", "subTopicId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TopicMap_courseVersionId_lessonId_topicId_key" ON "TopicMap"("courseVersionId", "lessonId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_token_key" ON "UserToken"("token");

-- CreateIndex
CREATE INDEX "UserToken_userId_idx" ON "UserToken"("userId");

-- CreateIndex
CREATE INDEX "UserToken_type_idx" ON "UserToken"("type");

-- AddForeignKey
ALTER TABLE "ChapterMap" ADD CONSTRAINT "ChapterMap_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterMap" ADD CONSTRAINT "ChapterMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterMap" ADD CONSTRAINT "ChapterMap_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseVersion" ADD CONSTRAINT "CourseVersion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseVersion" ADD CONSTRAINT "CourseVersion_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessonMap" ADD CONSTRAINT "lessonMap_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessonMap" ADD CONSTRAINT "lessonMap_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessonMap" ADD CONSTRAINT "lessonMap_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleMap" ADD CONSTRAINT "ModuleMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleMap" ADD CONSTRAINT "ModuleMap_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subTopicMap" ADD CONSTRAINT "subTopicMap_subTopicId_fkey" FOREIGN KEY ("subTopicId") REFERENCES "SubTopics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subTopicMap" ADD CONSTRAINT "subTopicMap_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subTopicMap" ADD CONSTRAINT "subTopicMap_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMap" ADD CONSTRAINT "TopicMap_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMap" ADD CONSTRAINT "TopicMap_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMap" ADD CONSTRAINT "TopicMap_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLinks" ADD CONSTRAINT "SocialLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
