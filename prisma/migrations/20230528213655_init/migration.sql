-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL,
    "name" TEXT,
    "nickname" TEXT NOT NULL,
    "sex" TEXT,
    "age" TEXT,
    "email" TEXT NOT NULL,
    "image_url" TEXT,
    "current_job" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "CurrentJobDetail" (
    "current_job_detail_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "grade" TEXT NOT NULL,
    "active_period" TEXT NOT NULL,
    "escaped_job" TEXT NOT NULL,
    "escaped_period" TEXT NOT NULL,
    "inactive_period" TEXT NOT NULL,
    "other_job" TEXT NOT NULL,

    CONSTRAINT "CurrentJobDetail_pkey" PRIMARY KEY ("current_job_detail_id")
);

-- CreateTable
CREATE TABLE "JobOfInterest" (
    "job_of_interest_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job_of_interest" TEXT NOT NULL,

    CONSTRAINT "JobOfInterest_pkey" PRIMARY KEY ("job_of_interest_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" UUID NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "logo_url" VARCHAR,
    "company_type" VARCHAR NOT NULL,
    "employee" INTEGER NOT NULL,
    "incorporation" DATE NOT NULL,
    "company_location" VARCHAR NOT NULL,
    "company_website" VARCHAR NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "Position" (
    "job_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "title" VARCHAR,
    "category" VARCHAR NOT NULL,
    "deadline" DATE NOT NULL,
    "experience" VARCHAR,
    "education" VARCHAR,
    "requirements" VARCHAR,
    "preferences" VARCHAR,
    "salary" VARCHAR,
    "job_type" VARCHAR,
    "job_location" VARCHAR NOT NULL,
    "details" VARCHAR,
    "job_website" VARCHAR,
    "hits" INTEGER NOT NULL,
    "title_image_url" VARCHAR,
    "details_image_url" VARCHAR,
    "bookmarks" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6),

    CONSTRAINT "Position_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "BookmarkedJobNotice" (
    "bookmarked_job_notice_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,

    CONSTRAINT "BookmarkedJobNotice_pkey" PRIMARY KEY ("bookmarked_job_notice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentJobDetail_user_id_key" ON "CurrentJobDetail"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "JobOfInterest_user_id_key" ON "JobOfInterest"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_company_name_key" ON "Company"("company_name");

-- AddForeignKey
ALTER TABLE "CurrentJobDetail" ADD CONSTRAINT "CurrentJobDetail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOfInterest" ADD CONSTRAINT "JobOfInterest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedJobNotice" ADD CONSTRAINT "BookmarkedJobNotice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedJobNotice" ADD CONSTRAINT "BookmarkedJobNotice_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Position"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
