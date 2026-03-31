/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentId,subTopicId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_enrollmentId_subTopicId_key" ON "UserProgress"("enrollmentId", "subTopicId");
