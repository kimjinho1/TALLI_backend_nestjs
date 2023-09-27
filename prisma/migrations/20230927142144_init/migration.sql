-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255),
    "nickname" VARCHAR(255) NOT NULL,
    "sex" VARCHAR(255),
    "age" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255),
    "current_job" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "CurrentJobDetail" (
    "current_job_detail_id" UUID NOT NULL,
    "grade" VARCHAR(255) NOT NULL,
    "active_period" VARCHAR(255) NOT NULL,
    "escaped_job" VARCHAR(255) NOT NULL,
    "escaped_period" VARCHAR(255) NOT NULL,
    "inactive_period" VARCHAR(255) NOT NULL,
    "other_job" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "CurrentJobDetail_pkey" PRIMARY KEY ("current_job_detail_id")
);

-- CreateTable
CREATE TABLE "Job" (
    "job_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "JobOfInterest" (
    "user_id" UUID NOT NULL,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "JobOfInterest_pkey" PRIMARY KEY ("user_id","job_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "logo_url" VARCHAR(255),
    "company_type" VARCHAR(255) NOT NULL,
    "employee" INTEGER,
    "incorporation" TIMESTAMP(3),
    "company_location" VARCHAR(255) NOT NULL,
    "company_website" VARCHAR(255),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "JobNotice" (
    "job_notice_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "title_image_url" VARCHAR(255),
    "category" VARCHAR(255) NOT NULL,
    "deadline" TIMESTAMP(3),
    "experience" VARCHAR(255) NOT NULL,
    "education" VARCHAR(255) NOT NULL,
    "requirements" TEXT,
    "preferences" TEXT,
    "salary" VARCHAR(255),
    "job_type" VARCHAR(255) NOT NULL,
    "job_location" VARCHAR(255) NOT NULL,
    "details" TEXT,
    "details_image_url" VARCHAR(255),
    "job_website" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "bookmarks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "JobNotice_pkey" PRIMARY KEY ("job_notice_id")
);

-- CreateTable
CREATE TABLE "BookmarkedJobNotice" (
    "user_id" UUID NOT NULL,
    "job_notice_id" INTEGER NOT NULL,

    CONSTRAINT "BookmarkedJobNotice_pkey" PRIMARY KEY ("user_id","job_notice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentJobDetail_user_id_key" ON "CurrentJobDetail"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_company_name_key" ON "Company"("company_name");

-- AddForeignKey
ALTER TABLE "CurrentJobDetail" ADD CONSTRAINT "CurrentJobDetail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOfInterest" ADD CONSTRAINT "JobOfInterest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOfInterest" ADD CONSTRAINT "JobOfInterest_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobNotice" ADD CONSTRAINT "JobNotice_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedJobNotice" ADD CONSTRAINT "BookmarkedJobNotice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedJobNotice" ADD CONSTRAINT "BookmarkedJobNotice_job_notice_id_fkey" FOREIGN KEY ("job_notice_id") REFERENCES "JobNotice"("job_notice_id") ON DELETE CASCADE ON UPDATE CASCADE;
