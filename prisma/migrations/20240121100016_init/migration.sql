-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255),
    "nickname" VARCHAR(255) NOT NULL,
    "sex" VARCHAR(255),
    "age" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(10) NOT NULL DEFAULT 'USER',
    "provider" VARCHAR(20) NOT NULL,
    "password" VARCHAR(20),
    "image_url" VARCHAR(255),
    "current_job" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "current_job_detail" (
    "current_job_detail_id" UUID NOT NULL,
    "grade" VARCHAR(255) NOT NULL,
    "active_period" VARCHAR(255) NOT NULL,
    "escaped_job" VARCHAR(255) NOT NULL,
    "escaped_period" VARCHAR(255) NOT NULL,
    "inactive_period" VARCHAR(255) NOT NULL,
    "other_job" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "current_job_detail_pkey" PRIMARY KEY ("current_job_detail_id")
);

-- CreateTable
CREATE TABLE "job" (
    "job_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "job_of_interest" (
    "user_id" UUID NOT NULL,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "job_of_interest_pkey" PRIMARY KEY ("user_id","job_id")
);

-- CreateTable
CREATE TABLE "company" (
    "company_id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "logo_url" VARCHAR(255),
    "company_type" VARCHAR(255) NOT NULL,
    "employee" INTEGER,
    "incorporation" TIMESTAMP(3),
    "company_location" VARCHAR(255) NOT NULL,
    "company_website" VARCHAR(255),

    CONSTRAINT "company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "job_notice" (
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

    CONSTRAINT "job_notice_pkey" PRIMARY KEY ("job_notice_id")
);

-- CreateTable
CREATE TABLE "bookmarked_job_notice" (
    "user_id" UUID NOT NULL,
    "job_notice_id" INTEGER NOT NULL,

    CONSTRAINT "bookmarked_job_notice_pkey" PRIMARY KEY ("user_id","job_notice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "current_job_detail_user_id_key" ON "current_job_detail"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_title_key" ON "job"("title");

-- CreateIndex
CREATE UNIQUE INDEX "company_company_name_key" ON "company"("company_name");

-- AddForeignKey
ALTER TABLE "current_job_detail" ADD CONSTRAINT "current_job_detail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_of_interest" ADD CONSTRAINT "job_of_interest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_of_interest" ADD CONSTRAINT "job_of_interest_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_notice" ADD CONSTRAINT "job_notice_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarked_job_notice" ADD CONSTRAINT "bookmarked_job_notice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarked_job_notice" ADD CONSTRAINT "bookmarked_job_notice_job_notice_id_fkey" FOREIGN KEY ("job_notice_id") REFERENCES "job_notice"("job_notice_id") ON DELETE CASCADE ON UPDATE CASCADE;
