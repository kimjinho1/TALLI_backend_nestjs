import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CompanyRepository } from './adapter/repository/company.repository'
import { JobNoticeRepository } from './adapter/repository/job-notice.repository'
import { UserRepository } from './adapter/repository/user.repository'
import { CompanyController } from './adapter/web/company.controller'
import { JobNoticeController } from './adapter/web/job-notice.controller'
import { UserController } from './adapter/web/user.controller'
import { CompanyService } from './application/service/company.service'
import { JobNoticeService } from './application/service/job-notice.service'
import { UserService } from './application/service/user.service'

@Module({
  controllers: [UserController, CompanyController, JobNoticeController],
  providers: [
    PrismaService,
    UserService,
    UserRepository,
    CompanyService,
    CompanyRepository,
    JobNoticeService,
    JobNoticeRepository
  ]
})
export class CoreModule {}
