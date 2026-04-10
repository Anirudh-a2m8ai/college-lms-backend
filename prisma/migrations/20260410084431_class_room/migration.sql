-- AlterTable
ALTER TABLE "ClassRoom" ADD COLUMN     "lastAccessedSubTopicId" TEXT;

-- CreateTable
CREATE TABLE "ClassRoomProgress" (
    "id" TEXT NOT NULL,
    "classRoomId" TEXT NOT NULL,
    "subTopicId" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL,
    "currentTimeStamp" INTEGER NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClassRoomProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassRoomProgress" ADD CONSTRAINT "ClassRoomProgress_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoomProgress" ADD CONSTRAINT "ClassRoomProgress_subTopicId_fkey" FOREIGN KEY ("subTopicId") REFERENCES "SubTopics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
