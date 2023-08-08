import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { UserController } from './adapter/web/user.controller'
import { UserService } from './application/service/user.service'
import { UserRepository } from './adapter/repository/user.repository'
import { CompanyController } from './adapter/web/company.controller'
import { CompanyService } from './application/service/company.service'
import { CompanyRepository } from './adapter/repository/company.repository'
import { JobNoticeService } from './application/service/job-notice.service'
import { JobNoticeRepository } from './adapter/repository/job-notice.repository'
import { JobNoticeController } from './adapter/web/job-notice.controller'

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
