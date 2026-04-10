-- AlterTable
ALTER TABLE "Enrollments" ADD COLUMN     "courseVersionId" TEXT,
ALTER COLUMN "classRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
