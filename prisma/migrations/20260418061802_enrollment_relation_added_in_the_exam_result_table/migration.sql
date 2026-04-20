/*
  Warnings:

  - Added the required column `enrollmentId` to the `ExamAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollmentId` to the `ExamResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamAttempt" ADD COLUMN     "enrollmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExamResult" ADD COLUMN     "enrollmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
