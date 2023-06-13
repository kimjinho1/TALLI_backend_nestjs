import { Company, JobNotice } from '@prisma/client'

export interface CreateJobNoticeResponseDto {
  jobNotice: JobNotice
  companyInfo: Company
}
