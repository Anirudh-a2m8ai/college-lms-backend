/*
  Warnings:

  - You are about to drop the column `shuffleOptions` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `shuffleQuestions` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `tenantId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "shuffleOptions",
DROP COLUMN "shuffleQuestions",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
