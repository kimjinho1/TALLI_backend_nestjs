import { Module } from '@nestjs/common'
import { JobNoticeService } from './job-notice.service'
import { JobNoticeController } from './job-notice.controller'
import { PrismaService } from 'prisma/prisma.service'
import { JobNoticeRepository } from './job-notice.repository'
import { CompanyRepository } from 'src/company/company.repository'
import { UserRepository } from 'src/user/user.repository'

@Module({
  controllers: [JobNoticeController],
  providers: [JobNoticeService, PrismaService, JobNoticeRepository, CompanyRepository, UserRepository]
})
export class JobNoticeModule {}
