/*
  Warnings:

  - Added the required column `moduleId` to the `ClassChapterMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `ClassLessonMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `ClassSubTopicMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `ClassTopicMap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassChapterMap" ADD COLUMN     "moduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClassLessonMap" ADD COLUMN     "chapterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClassSubTopicMap" ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClassTopicMap" ADD COLUMN     "lessonId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ClassChapterMap" ADD CONSTRAINT "ClassChapterMap_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLessonMap" ADD CONSTRAINT "ClassLessonMap_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTopicMap" ADD CONSTRAINT "ClassTopicMap_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubTopicMap" ADD CONSTRAINT "ClassSubTopicMap_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
