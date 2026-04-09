/*
  Warnings:

  - You are about to drop the column `courseVersionId` on the `Enrollments` table. All the data in the column will be lost.
  - Added the required column `classRoomId` to the `Enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassRoomStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_courseVersionId_fkey";

-- AlterTable
ALTER TABLE "Enrollments" DROP COLUMN "courseVersionId",
ADD COLUMN     "classRoomId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ClassModuleMap" (
    "id" TEXT NOT NULL,
    "classRoomId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "ClassModuleMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassChapterMap" (
    "id" TEXT NOT NULL,
    "classRoomId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "ClassChapterMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassLessonMap" (
    "id" TEXT NOT NULL,
    "classRoomId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "ClassLessonMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassTopicMap" (
    "id" TEXT NOT NULL,
    "classRoomId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "ClassTopicMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSubTopicMap" (
    "id" TEXT NOT NULL,
    "classRoomId" TEXT NOT NULL,
    "subTopicId" TEXT NOT NULL,

    CONSTRAINT "ClassSubTopicMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ClassRoomStatus" NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceCourseVersionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "ClassRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "rollNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialization" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassModuleMap" ADD CONSTRAINT "ClassModuleMap_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassModuleMap" ADD CONSTRAINT "ClassModuleMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassChapterMap" ADD CONSTRAINT "ClassChapterMap_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassChapterMap" ADD CONSTRAINT "ClassChapterMap_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLessonMap" ADD CONSTRAINT "ClassLessonMap_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLessonMap" ADD CONSTRAINT "ClassLessonMap_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTopicMap" ADD CONSTRAINT "ClassTopicMap_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTopicMap" ADD CONSTRAINT "ClassTopicMap_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubTopicMap" ADD CONSTRAINT "ClassSubTopicMap_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubTopicMap" ADD CONSTRAINT "ClassSubTopicMap_subTopicId_fkey" FOREIGN KEY ("subTopicId") REFERENCES "SubTopics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_sourceCourseVersionId_fkey" FOREIGN KEY ("sourceCourseVersionId") REFERENCES "CourseVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
