-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "classRoomId" TEXT,
ALTER COLUMN "courseVersionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
