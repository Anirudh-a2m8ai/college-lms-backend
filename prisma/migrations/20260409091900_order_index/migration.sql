-- AlterTable
ALTER TABLE "ClassChapterMap" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ClassLessonMap" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ClassModuleMap" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ClassSubTopicMap" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ClassTopicMap" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;
