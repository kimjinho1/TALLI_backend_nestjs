/*
  Warnings:

  - You are about to drop the `JobHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JobHistory" DROP CONSTRAINT "JobHistory_user_id_fkey";

-- DropTable
DROP TABLE "JobHistory";

-- CreateTable
CREATE TABLE "CurrentJobDetail" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "grade" TEXT NOT NULL,
    "active_period" TEXT NOT NULL,
    "escaped_job" TEXT NOT NULL,
    "escaped_period" TEXT NOT NULL,
    "inactive_period" TEXT NOT NULL,
    "other_job" TEXT NOT NULL,

    CONSTRAINT "CurrentJobDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrentJobDetail_user_id_key" ON "CurrentJobDetail"("user_id");

-- AddForeignKey
ALTER TABLE "CurrentJobDetail" ADD CONSTRAINT "CurrentJobDetail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
