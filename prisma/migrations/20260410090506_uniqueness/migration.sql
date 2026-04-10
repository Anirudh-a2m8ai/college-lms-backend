/*
  Warnings:

  - A unique constraint covering the columns `[classRoomId,subTopicId]` on the table `ClassRoomProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClassRoomProgress_classRoomId_subTopicId_key" ON "ClassRoomProgress"("classRoomId", "subTopicId");
