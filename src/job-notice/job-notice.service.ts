import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Company, JobNotice } from '@prisma/client'
import { CompanyRepository } from 'src/company/repository/company.repository'
import { CreateJobNoticeDto, ICreateJobNoticeResponse } from './dto/CreateJobNotice.dto'
import { JobNoticeRepository } from './repository/job-notice.repository'

@Injectable()
export class JobNoticeService {
  constructor(
    private readonly repository: JobNoticeRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  // 채용 공고 추가
  async createJobNotice(createJobNoticeDto: CreateJobNoticeDto): Promise<ICreateJobNoticeResponse> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedCompany: Company | null = await this.companyRepository.getCompanyById(createJobNoticeDto.companyId)
    if (!existedCompany) {
      throw new NotFoundException('존재하지 않는 회사입니다')
    }

    // 채용 공고 중복 처리 -> 에러일 시 409 에러 코드 반환
    const existedJobNotice: JobNotice | null = await this.repository.getJobNoticeByCompanyIdAndTitle(
      createJobNoticeDto.companyId,
      createJobNoticeDto.title
    )
    if (existedJobNotice) {
      throw new ConflictException('이미 존재하는 채용 공고입니다.')
    }

    // JobNotice 생성
    const createdJobNotice: JobNotice = await this.repository.createJobNotice(createJobNoticeDto)
    const response: ICreateJobNoticeResponse = {
      jobNotice: createdJobNotice,
      companyInfo: existedCompany
    }

    return response
  }
}
