import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BookmarkedJobNotice, JobNotice, Prisma } from '@prisma/client'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { CompanyRepository } from 'src/core/adapter/repository/company.repository'
import { FilteredJobNoticeListDto } from 'src/core/adapter/repository/dto/job-notice'
import { JobNoticeRepository } from 'src/core/adapter/repository/job-notice.repository'
import {
  CreateJobNoticeCommand,
  FilterDto,
  GetJobNoticeListCommand,
  SearchJobNoticeListCommand,
  UpdateJobNoticeCommand,
  createBookmarkedJobNoticeCommand
} from 'src/core/adapter/web/command/job-notice'
import { CompanyService } from './company.service'
import { FilteredJobNotice, JobNoticeDto, JobNoticeInfoDto, JobNoticeListDto } from './dto/job-notice/response'
import { UserService } from './user.service'

@Injectable()
export class JobNoticeService {
  constructor(
    private readonly repository: JobNoticeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly companyService: CompanyService,
    private readonly userService: UserService
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
    await this.repository.incrementHits(jobId)
    const { jobNoticeId, ...tempJobNotice } = jobNotice

    const result = {
      jobNotice: {
        ...tempJobNotice,
        jobId: jobNoticeId,
        hits: jobNotice.hits + 1
      },
      companyInfo: company
    }

    return result
  }

  /** 채용 공고 검색 */
  async searchJobNoticeList(dto: SearchJobNoticeListCommand): Promise<JobNoticeListDto> {
    /** 쿼리 생성 */
    const { index, difference, searchWord, order, filter } = dto
    const jobNoticeFilter = this.getFilter(filter)
    const query = this.getQueryBySearchWord(order, searchWord, jobNoticeFilter)

    /** 필터링된 jobNotice들 */
    const tempJobNotices = await this.repository.getFilteredJobNotices(query)
    const filteredJobNotices = tempJobNotices.slice(index, difference)

    return this.getResultList(tempJobNotices.length, filteredJobNotices)
  }

  /** 채용 공고 북마크 추가 */
  async createBookmarkedJobNotice(jobId: number, userId: string): Promise<createBookmarkedJobNoticeCommand> {
    /** 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getJobNotice(jobId)

    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.userService.getUser(userId)

    /** 존재하는 북마크된 채용 공고인지 확인 -> 에러일 시 400 에러 코드 반환 */
    await this.checkBookmarkedJobNoticeDuplicate(jobId, userId)

    const bookmarkedJobNotice = await this.repository.createBookmarkedJobNotice(jobId, userId)
    this.repository.incrementBookmarks(jobId)
    const result = {
      jobId: bookmarkedJobNotice.jobNoticeId,
      userId: bookmarkedJobNotice.userId
    }

    return result
  }

  /** 채용 공고 북마크 삭제 */
  async deleteBookmarkedJobNotice(jobId: number, userId: string): Promise<createBookmarkedJobNoticeCommand> {
    /** 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getJobNotice(jobId)

    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.userService.getUser(userId)

    /** 북마크된 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const bookmarkedJobNotice = await this.getBookmarkedJobNotice(jobId, userId)

    await this.repository.deleteBookmarkedJobNotice(jobId, userId)
    this.repository.decrementBookmarks(jobId)
    const result = {
      jobId: bookmarkedJobNotice.jobNoticeId,
      userId: bookmarkedJobNotice.userId
    }

    return result
  }

  /** 북마크한 채용 공고 보기 */
  async getAllBookmarkedJobNotice(userId: string, order: string): Promise<FilteredJobNotice[]> {
    /** 쿼리 생성 */
    const query = this.getQueryByorder(order)
    query.where = {
      bookmarkedJobNotices: {
        some: {
          userId
        }
      }
    }

    /** 필터링된 jobNotice들 */
    const JobNotices = await this.repository.getFilteredJobNotices(query)

    const resultList = this.createResultList(JobNotices)

    return resultList
  }

  /** 채용 공고 추가 */
  async createJobNotice(dto: CreateJobNoticeCommand): Promise<JobNoticeInfoDto> {
    /** 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const company = await this.companyService.getCompany(dto.companyId)

    /** 채용 공고 중복 확인 -> 에러일 시 400 에러 코드 반환 */
    await this.checkJobNoticeDuplicateByTitle(dto.companyId, dto.title)

    /** 채용 공고 생성 */
    const createdJobNotice = await this.repository.createJobNotice(dto)
    const { jobNoticeId, ...tempJobNotice } = createdJobNotice

    const result = {
      jobNotice: { jobId: jobNoticeId, ...tempJobNotice },
      companyInfo: company
    }
    return result
  }

  /** 채용 공고 수정 */
  async updateJobNotice(jobId: number, dto: UpdateJobNoticeCommand): Promise<JobNoticeInfoDto> {
    /** 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환 */
    if (dto.companyId !== undefined) {
      await this.companyService.getCompany(dto.companyId)
    }

    /** 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const jobNotice = await this.getJobNotice(jobId)

    /** 반환용 Company */
    const company = await this.companyService.getCompany(jobNotice.companyId)

    /** JobNotice 업데이트 */
    const updateJobNotice = await this.repository.updateJobNotice(jobId, dto)
    const { jobNoticeId, ...tempJobNotice } = updateJobNotice

    const result = {
      jobNotice: { jobId: jobNoticeId, ...tempJobNotice },
      companyInfo: company
    }

    return result
  }

  /** 채용 공고 삭제 */
  async deleteJobNotice(jobId: number): Promise<JobNoticeDto> {
    /** 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const jobNotice = await this.getJobNotice(jobId)

    const deletedJobNotice = await this.repository.deleteJobNotice(jobId)

    const { jobNoticeId, ...tempJobNotice } = deletedJobNotice

    const result = {
      jobId: jobNoticeId,
      ...tempJobNotice
    }

    return result
  }

  /** 검색 자동 완성 목록 보기 */
  async getAutoComplete(): Promise<string[]> {
    const companyNames = await this.companyRepository.getAllCompanyNames()
    const jobNoticeTitles = await this.repository.getAllJobNoticeTitles()
    return [
      ...companyNames.map(companyName => companyName.companyName),
      ...jobNoticeTitles.map(jobNoticeTitle => jobNoticeTitle.title)
    ]
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

  private getQueryByorder(order: string): Prisma.JobNoticeFindManyArgs {
    return {
      orderBy: this.getOrder(order)
    }
  }

  /** 정렬 기준을 정하기 */
  private getOrder(order: string): Prisma.JobNoticeOrderByWithRelationInput {
    switch (order) {
      case '최신 등록 순':
        return { createdAt: 'desc' }
      case 'new':
        return { createdAt: 'desc' }

      case '조회 많은 순':
        return { hits: 'desc' }
      case 'popular':
        return { hits: 'desc' }

      case '북마크 많은 순':
        return { bookmarkedJobNotices: { _count: 'desc' } }
      case 'bookmark':
        return { bookmarkedJobNotices: { _count: 'desc' } }

      case '마감일 빠른 순':
        return { deadline: 'asc' }
      case 'deadline':
        return { deadline: 'asc' }

      default:
        return { createdAt: 'desc' }
    }
  }

  /** 채용 공고 필터 response 생성 */
  private createResultList(JobNotices: FilteredJobNoticeListDto): FilteredJobNotice[] {
    const resultList = JobNotices.map(jobNotice => {
      return {
        jobId: jobNotice.jobNoticeId,
        title: jobNotice.title,
        titleImageUrl: jobNotice.titleImageUrl,
        companyName: jobNotice.company.companyName,
        logoUrl: jobNotice.company.logoUrl,
        jobLocation: jobNotice.jobLocation,
        experience: jobNotice.experience,
        deadline: jobNotice.deadline || new Date('2999-12-31'),
        hits: jobNotice.hits,
        bookmarks: jobNotice.bookmarks
      }
    })
    return resultList
  }

  /** 채용 공고 필터 response 생성 */
  private getResultList(numTotal: number, filteredJobNotices: FilteredJobNoticeListDto): JobNoticeListDto {
    const resultList = this.createResultList(filteredJobNotices)

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

  /** 북마크된 채용 공고 중복 확인 -> 에러일 시 400 에러 코드 반환 */
  private async checkBookmarkedJobNoticeDuplicate(jobId: number, userId: string): Promise<void> {
    const bookmarkedJobNotice = await this.repository.getBookmarkedJobNotice(jobId, userId)
    if (bookmarkedJobNotice) {
      throw new BadRequestException(ErrorMessages.BOOKMARKEND_JOB_NOTICE_ALREADY_EXISTS)
    }
  }

  /** 북마크된 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환 */
  private async getBookmarkedJobNotice(jobId: number, userId: string): Promise<BookmarkedJobNotice> {
    const bookmarkedJobNotice = await this.repository.getBookmarkedJobNotice(jobId, userId)
    if (!bookmarkedJobNotice) {
      throw new NotFoundException(ErrorMessages.BOOKMARKEND_JOB_NOTICE_NOT_FOUND)
    }
    return bookmarkedJobNotice
  }
}
