/*
  Warnings:

  - You are about to drop the column `courseSectionId` on the `quizProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quizProgress" DROP COLUMN "courseSectionId";

-- AddForeignKey
ALTER TABLE "quizProgress" ADD CONSTRAINT "quizProgress_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
