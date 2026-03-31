/*
  Warnings:

  - You are about to drop the `UserProcess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProcess" DROP CONSTRAINT "UserProcess_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "UserProcess" DROP CONSTRAINT "UserProcess_subTopicId_fkey";

-- DropForeignKey
ALTER TABLE "UserProcess" DROP CONSTRAINT "UserProcess_userId_fkey";

-- DropTable
DROP TABLE "UserProcess";

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subTopicId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL,
    "currentTimeStamp" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_subTopicId_fkey" FOREIGN KEY ("subTopicId") REFERENCES "SubTopics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
