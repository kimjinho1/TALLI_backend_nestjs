import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BookmarkedJobNotice, Company, JobNotice, Prisma, User } from '@prisma/client'
import { CompanyRepository } from 'src/core/adapter/repository/company.repository'
import { JobNoticeRepository } from 'src/core/adapter/repository/job-notice.repository'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { JobNoticeInfoDto, JobNoticeListDto } from './dto/job-notice/response'
import { CreateJobNoticeCommand, FilterDto, GetJobNoticeListCommand } from 'src/core/adapter/web/command/job-notice'
import { CompanyService } from './company.service'
import { ErrorMessages } from 'src/common/exception/error.messages'

@Injectable()
export class JobNoticeService {
  constructor(
    private readonly repository: JobNoticeRepository,
    private readonly companyService: CompanyService,
    private readonly userRepository: UserRepository
  ) {}

  /** 전체 채용 공고 보기 */
  async getAllJobNotice(dto: GetJobNoticeListCommand): Promise<JobNoticeListDto> {
    /** 쿼리 생성 */
    const { index, difference, category, order, filter } = dto
    const jobNoticeFilter = this.getFilter(filter)
    const query = this.getQueryByCategory(order, category, jobNoticeFilter)

    /** 필터링된 jobNotice들 */
    const tempJobNotices = await this.repository.getFilteredJobNotices(query)
    const filteredJobNotices = tempJobNotices.slice(index, difference)

    return this.getResultList(tempJobNotices.length, filteredJobNotices)
  }

  /** 개별 채용 공고 보기 */
  async getJobNoticeInfo(jobId: number): Promise<JobNoticeInfoDto> {
    /** 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const jobNotice = await this.getJobNotice(jobId)

    /** 반환용 Company */
    const company = await this.companyService.getCompany(jobNotice.companyId)

    /** jobNotice의 hits 카운트 올리기 */
    await this.repository.updateJobNoticeHits(jobId)

    const response = {
      jobNotice: {
        ...jobNotice,
        hits: jobNotice.hits + 1
      },
      companyInfo: company
    }
    return response
  }

  /** 채용 공고 추가 */
  async createJobNotice(dto: CreateJobNoticeCommand): Promise<JobNoticeInfoDto> {
    /** 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const existedCompany = await this.companyService.getCompany(dto.companyId)

    /** 채용 공고 중복 확인 -> 에러일 시 400 에러 코드 반환 */
    await this.checkJobNoticeDuplicateByTitle(dto.companyId, dto.title)

    /** 채용 공고 생성 */
    const createdJobNotice = await this.repository.createJobNotice(dto)

    const response = {
      jobNotice: createdJobNotice,
      companyInfo: existedCompany
    }
    return response
  }

  /**
   * UTILS
   */

  /** 필터 생성 */
  private getFilter(filter: FilterDto): Prisma.JobNoticeWhereInput {
    const { location, experience, education, certificate, companyType, jobType } = filter
    return {
      jobLocation: location.length > 0 ? { in: location } : undefined,
      experience: experience.length > 0 ? { in: experience } : undefined,
      education: education.length > 0 ? { in: education } : undefined,
      requirements: certificate.length > 0 ? { in: certificate } : undefined,
      company: {
        companyType: companyType.length > 0 ? { in: companyType } : undefined
      },
      jobType: jobType.length > 0 ? { in: jobType } : undefined
    }
  }

  /** Category 기반 쿼리 생성 */
  private getQueryByCategory(
    order: string,
    category: string,
    jobNoticeFilter: Prisma.JobNoticeWhereInput
  ): Prisma.JobNoticeFindManyArgs {
    return {
      orderBy: this.getOrder(order),
      where: category !== '전체' ? { category, ...jobNoticeFilter } : jobNoticeFilter
    }
  }

  /** 정렬 기준을 정하기 */
  private getOrder(order: string): Prisma.JobNoticeOrderByWithRelationInput {
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

  /** 채용 공고 필터 response 생성 */
  private getResultList(numTotal: number, filteredJobNotices: any[]): JobNoticeListDto {
    const resultList = filteredJobNotices.map(jobNotice => {
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
    return {
      numTotal,
      resultList
    }
  }

  /** searchWord 기반 쿼리 생성 */
  private getQueryBySearchWord(
    order: string,
    searchWord: string,
    jobNoticeFilter: Prisma.JobNoticeWhereInput
  ): Prisma.JobNoticeFindManyArgs {
    return {
      orderBy: this.getOrder(order),
      where: {
        title: {
          contains: searchWord
        },
        ...jobNoticeFilter
      },
      include: {
        company: {
          select: {
            companyName: true,
            logoUrl: true
          }
        },
        bookmarkedJobNotices: {
          select: {
            jobNoticeId: true
          }
        }
      }
    }
  }

  /** 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
  private async getJobNotice(jobId: number): Promise<JobNotice> {
    try {
      const jobNotice = await this.repository.getJobNotice(jobId)
      return jobNotice
    } catch (error) {
      throw new NotFoundException(ErrorMessages.JOB_NOTICE_NOT_FOUND)
    }
  }

  /** 채용 공고 중복 확인 -> 에러일 시 400 에러 코드 반환 */
  private async checkJobNoticeDuplicateByTitle(companyId: number, title: string): Promise<void> {
    const jobNotice = await this.repository.getJobNoticeByCompanyIdAndTitle(companyId, title)
    if (jobNotice) {
      throw new BadRequestException(ErrorMessages.JOB_NOTICE_ALREADY_EXISTS)
    }
  }
}
