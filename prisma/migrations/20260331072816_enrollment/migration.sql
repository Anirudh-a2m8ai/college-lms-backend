/*
  Warnings:

  - You are about to drop the column `totalLessons` on the `Enrollments` table. All the data in the column will be lost.
  - Added the required column `totalSubTopics` to the `Enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollments" DROP COLUMN "totalLessons",
ADD COLUMN     "completedQuizzes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedSubTopics" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSubTopics" INTEGER NOT NULL;
