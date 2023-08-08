import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BookmarkedJobNotice, Company, JobNotice, Prisma, User } from '@prisma/client'
import { CompanyRepository } from 'src/core/adapter/repository/company.repository'
import { JobNoticeRepository } from 'src/core/adapter/repository/job-notice.repository'
import { UserRepository } from 'src/core/adapter/repository/user.repository'

@Injectable()
export class JobNoticeService {
  constructor(
    private readonly repository: JobNoticeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository
  ) {}
}
