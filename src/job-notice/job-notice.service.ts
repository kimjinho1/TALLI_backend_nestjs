import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Company, JobNotice, Prisma } from '@prisma/client'
import { CompanyRepository } from 'src/company/company.repository'
import {
  CreateJobNoticeDto,
  GetJobNoticeListDto,
  ICreateJobNoticeResponse,
  IGetAllJobNoticeResponse,
  IGetFilteredJobNotices,
  UpdateJobNoticeDto
} from './dto'
import { JobNoticeRepository } from './job-notice.repository'

@Injectable()
export class JobNoticeService {
  constructor(
    private readonly repository: JobNoticeRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  // 정렬 기준을 정해주는 함수
  private getOrderByClause(order: string): Prisma.JobNoticeOrderByWithRelationInput {
    switch (order) {
      case '최신 등록 순':
        return { createdAt: 'desc' }
      case '조회 많은 순':
        return { hits: 'desc' }
      case '북마크 많은 순':
        return { bookmarkedJobNotices: { _count: 'desc' } }
      case '마감일 빠른 순':
        return { deadline: 'asc' }
      default:
        return { createdAt: 'desc' }
    }
  }

  // 전체 채용 공고 보기
  async getAllJobNotice(getJobNoticeListDto: GetJobNoticeListDto): Promise<IGetAllJobNoticeResponse> {
    const { index, difference, category, order, filter } = getJobNoticeListDto
    const { location, experience, education, certificate, companyType, jobType } = filter

    // 필터링
    const jobNoticeFilter: Prisma.JobNoticeWhereInput = {
      jobLocation: location.length > 0 ? { in: location } : undefined,
      experience: experience.length > 0 ? { in: experience } : undefined,
      education: education.length > 0 ? { in: education } : undefined,
      requirements: certificate.length > 0 ? { in: certificate } : undefined,
      company: {
        companyType: companyType.length > 0 ? { in: companyType } : undefined
      },
      jobType: jobType.length > 0 ? { in: jobType } : undefined
    }

    // 쿼리
    const query: Prisma.JobNoticeFindManyArgs = {
      orderBy: this.getOrderByClause(order),
      where: category !== '전체' ? { category, ...jobNoticeFilter } : jobNoticeFilter,
      include: {
        company: {
          select: {
            companyName: true,
            logoUrl: true
          }
        },
        bookmarkedJobNotices: {
          select: {
            jobId: true
          }
        }
      }
    }

    // 필터링된 jobNotice들
    const tempJobNotices: any[] = await this.repository.getFilteredJobNotices(query)
    const filteredJobNotices: any[] = tempJobNotices.slice(index, difference)

    // response 생성
    const numTotal: number = tempJobNotices.length
    const resultList: IGetFilteredJobNotices[] = filteredJobNotices.map(jobNotice => {
      return {
        jobId: jobNotice.jobId,
        title: jobNotice.title,
        titleImageUrl: jobNotice.titleImageUrl,
        companyName: jobNotice.company.companyName,
        logoUrl: jobNotice.company.logoUrl,
        jobLocation: jobNotice.jobLocation,
        experience: jobNotice.experience,
        deadline: jobNotice.deadline?.toISOString().split('T')[0] || '2999-12-31',
        hits: jobNotice.hits,
        bookmarks: jobNotice.bookmarkedJobNotices.length
      }
    })
    const response: IGetAllJobNoticeResponse = {
      numTotal,
      resultList
    }

    return response
  }

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

    // response 생성
    const response: ICreateJobNoticeResponse = {
      jobNotice: createdJobNotice,
      companyInfo: existedCompany
    }

    return response
  }

  // 채용 공고 수정
  async updateJobNotice(jobId: number, updateJobNoticeDto: UpdateJobNoticeDto): Promise<ICreateJobNoticeResponse> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    if (updateJobNoticeDto.companyId !== undefined) {
      const existedCompany: Company | null = await this.companyRepository.getCompanyById(updateJobNoticeDto.companyId)
      if (!existedCompany) {
        throw new NotFoundException('존재하지 않는 회사입니다')
      }
    }

    // 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedJobNotice: JobNotice | null = await this.repository.getJobNoticeById(jobId)
    if (!existedJobNotice) {
      throw new NotFoundException('존재하지 않는 채용 공고입니다')
    }

    // 반환용 Company
    const company: Company | null = await this.companyRepository.getCompanyById(existedJobNotice.companyId)
    if (!company) {
      throw new NotFoundException('존재하지 않는 회사입니다')
    }

    // JobNotice 업데이트
    const updateJobNotice: JobNotice = await this.repository.updateJobNotice(jobId, updateJobNoticeDto)

    // response 생성
    const response: ICreateJobNoticeResponse = {
      jobNotice: updateJobNotice,
      companyInfo: company
    }

    return response
  }

  // 채용 공고 삭제
  async deleteJobNotice(jobId: number): Promise<JobNotice> {
    // 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedJobNotice: JobNotice | null = await this.repository.getJobNoticeById(jobId)
    if (!existedJobNotice) {
      throw new NotFoundException('존재하지 않는 채용 공고입니다')
    }

    // JobNotice 삭제
    const deletedJobNotice: JobNotice = await this.repository.deleteJobNotice(jobId)

    return deletedJobNotice
  }
}
