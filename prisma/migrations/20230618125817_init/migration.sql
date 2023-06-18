/*
  Warnings:

  - You are about to alter the column `company_name` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `logo_url` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `company_type` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `company_location` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `company_website` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `grade` on the `CurrentJobDetail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `active_period` on the `CurrentJobDetail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `escaped_job` on the `CurrentJobDetail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `escaped_period` on the `CurrentJobDetail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `inactive_period` on the `CurrentJobDetail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `other_job` on the `CurrentJobDetail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title_image_url` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `category` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `experience` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `education` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `requirements` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `preferences` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `salary` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `job_type` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `job_location` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `details` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `details_image_url` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `job_website` on the `JobNotice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `job_of_interest` on the `JobOfInterest` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nickname` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `sex` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `age` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `image_url` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `current_job` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "company_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "logo_url" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "company_type" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "incorporation" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "company_location" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "company_website" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "CurrentJobDetail" ALTER COLUMN "grade" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "active_period" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "escaped_job" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "escaped_period" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "inactive_period" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "other_job" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "JobNotice" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "title_image_url" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "category" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "experience" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "education" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "requirements" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "preferences" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "salary" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "job_type" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "job_location" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "details" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "details_image_url" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "job_website" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "JobOfInterest" ALTER COLUMN "job_of_interest" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "nickname" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "sex" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "age" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "image_url" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "current_job" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Content" (
    "content_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "creater" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "playform" VARCHAR(255) NOT NULL,
    "content_url" VARCHAR(255) NOT NULL,
    "thumbail_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "registered_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("content_id")
);
