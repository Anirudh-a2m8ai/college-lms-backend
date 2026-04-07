-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('CLASSROOM', 'SELF_PACED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "type" "CourseType";

-- AlterTable
ALTER TABLE "SubTopics" ADD COLUMN     "videoUrl" TEXT;
