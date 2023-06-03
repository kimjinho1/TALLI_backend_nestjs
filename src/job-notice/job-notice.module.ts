import { Module } from '@nestjs/common'
import { JobNoticeService } from './job-notice.service'
import { JobNoticeController } from './job-notice.controller'
import { PrismaService } from 'prisma/prisma.service'
import { JobNoticeRepository } from './job-notice.repository'
import { CompanyRepository } from 'src/company/company.repository'

@Module({
  controllers: [JobNoticeController],
  providers: [JobNoticeService, PrismaService, JobNoticeRepository, CompanyRepository]
})
export class JobNoticeModule {}
