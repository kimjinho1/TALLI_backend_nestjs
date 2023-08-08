/*
  Warnings:

  - The primary key for the `BookmarkedJobNotice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BookmarkedJobNotice` table. All the data in the column will be lost.
  - You are about to drop the column `job_id` on the `BookmarkedJobNotice` table. All the data in the column will be lost.
  - The primary key for the `CurrentJobDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CurrentJobDetail` table. All the data in the column will be lost.
  - The primary key for the `JobNotice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `job_id` on the `JobNotice` table. All the data in the column will be lost.
  - The primary key for the `JobOfInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `JobOfInterest` table. All the data in the column will be lost.
  - You are about to drop the column `job_of_interest` on the `JobOfInterest` table. All the data in the column will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `job_notice_id` to the `BookmarkedJobNotice` table without a default value. This is not possible if the table is not empty.
  - The required column `current_job_detail_id` was added to the `CurrentJobDetail` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `job_id` to the `JobOfInterest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookmarkedJobNotice" DROP CONSTRAINT "BookmarkedJobNotice_job_id_fkey";

-- AlterTable
ALTER TABLE "BookmarkedJobNotice" DROP CONSTRAINT "BookmarkedJobNotice_pkey",
DROP COLUMN "id",
DROP COLUMN "job_id",
ADD COLUMN     "job_notice_id" INTEGER NOT NULL,
ADD CONSTRAINT "BookmarkedJobNotice_pkey" PRIMARY KEY ("user_id", "job_notice_id");

-- AlterTable
ALTER TABLE "CurrentJobDetail" DROP CONSTRAINT "CurrentJobDetail_pkey",
DROP COLUMN "id",
ADD COLUMN     "current_job_detail_id" UUID NOT NULL,
ADD CONSTRAINT "CurrentJobDetail_pkey" PRIMARY KEY ("current_job_detail_id");

-- AlterTable
ALTER TABLE "JobNotice" DROP CONSTRAINT "JobNotice_pkey",
DROP COLUMN "job_id",
ADD COLUMN     "job_notice_id" SERIAL NOT NULL,
ADD CONSTRAINT "JobNotice_pkey" PRIMARY KEY ("job_notice_id");

-- AlterTable
ALTER TABLE "JobOfInterest" DROP CONSTRAINT "JobOfInterest_pkey",
DROP COLUMN "id",
DROP COLUMN "job_of_interest",
ADD COLUMN     "job_id" INTEGER NOT NULL,
ADD CONSTRAINT "JobOfInterest_pkey" PRIMARY KEY ("user_id", "job_id");

-- DropTable
DROP TABLE "Content";

-- CreateTable
CREATE TABLE "Job" (
    "job_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("job_id")
);

-- AddForeignKey
ALTER TABLE "JobOfInterest" ADD CONSTRAINT "JobOfInterest_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedJobNotice" ADD CONSTRAINT "BookmarkedJobNotice_job_notice_id_fkey" FOREIGN KEY ("job_notice_id") REFERENCES "JobNotice"("job_notice_id") ON DELETE CASCADE ON UPDATE CASCADE;
