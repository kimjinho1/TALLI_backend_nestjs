import { Company, JobNotice } from '@prisma/client'

export class CreateJobNoticeResponseDto {
  jobNotice: JobNotice
  companyInfo: Company
}
