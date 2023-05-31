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

-- CreateTable
CREATE TABLE "JobOfInterest" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job_of_interest" TEXT NOT NULL,

    CONSTRAINT "JobOfInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkedJobNotice" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "BookmarkedJobNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" SERIAL NOT NULL,
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
CREATE TABLE "JobNotice" (
    "job_id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
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
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(6),

    CONSTRAINT "JobNotice_pkey" PRIMARY KEY ("job_id")
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
ALTER TABLE "BookmarkedJobNotice" ADD CONSTRAINT "BookmarkedJobNotice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobNotice" ADD CONSTRAINT "JobNotice_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;