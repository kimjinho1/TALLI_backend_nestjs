import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { JobMapperService } from 'src/common/mapper/job-mapper.service'
import { StorageService } from 'src/storage/storage.service'
import { CompanyRepository } from './adapter/repository/company.repository'
import { JobNoticeRepository } from './adapter/repository/job-notice.repository'
import { QuestionRepository } from './adapter/repository/question.repository'
import { UserRepository } from './adapter/repository/user.repository'
import { CompanyController } from './adapter/web/company.controller'
import { JobNoticeController } from './adapter/web/job-notice.controller'
import { QuestionController } from './adapter/web/question.controller'
import { UserController } from './adapter/web/user.controller'
import { CompanyService } from './application/service/company.service'
import { JobNoticeService } from './application/service/job-notice.service'
import { QuestionService } from './application/service/question.service'
import { UserService } from './application/service/user.service'

@Module({
  controllers: [UserController, CompanyController, JobNoticeController, QuestionController],
  providers: [
    PrismaService,
    UserService,
    UserRepository,
    CompanyService,
    CompanyRepository,
    JobNoticeService,
    JobNoticeRepository,
    QuestionService,
    QuestionRepository,
    StorageService,
    JobMapperService
  ]
})
export class CoreModule {}
