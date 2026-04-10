-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('ENABLED', 'DISABLED');

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "deadLine" TIMESTAMP(3),
ADD COLUMN     "status" "QuizStatus";
