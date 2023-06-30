import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BookmarkedJobNotice, Company, JobNotice, Prisma, User } from '@prisma/client'
import { CompanyRepository } from 'src/company/company.repository'
import { UserRepository } from 'src/user/user.repository'
import { FilterDto, FilteredJobNoticeDto } from './dto'
import {
  CreateJobNoticeRequestDto,
  GetJobNoticeListRequestDto,
  SearchJobNoticeListRequestDto,
  UpdateJobNoticeRequestDto
} from './dto/request'
import { CreateJobNoticeResponseDto, GetAllJobNoticeResponseDto } from './dto/response'
import { JobNoticeRepository } from './job-notice.repository'

@Injectable()
export class JobNoticeService {
  constructor(
    private readonly repository: JobNoticeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository
  ) {}

  // 필터 생성
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

  // Category로 쿼리 생성
  private getQueryByCategory(
    order: string,
    category: string,
    jobNoticeFilter: Prisma.JobNoticeWhereInput
  ): Prisma.JobNoticeFindManyArgs {
    return {
      orderBy: this.getOrder(order),
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
  }

  // searchWord로 쿼리 생성
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
            jobId: true
          }
        }
      }
    }
  }

  // 정렬 기준을 정하기
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

  // 채용 공고 필터 response 생성
  private getResultList(length: number, filteredJobNotices: any[]): GetAllJobNoticeResponseDto {
    const numTotal: number = length
    const resultList: FilteredJobNoticeDto[] = filteredJobNotices.map(jobNotice => {
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

  // 전체 채용 공고 보기
  async getAllJobNotice(dto: GetJobNoticeListRequestDto): Promise<GetAllJobNoticeResponseDto> {
    // 쿼리 생성
    const { index, difference, category, order, filter } = dto
    const jobNoticeFilter: Prisma.JobNoticeWhereInput = this.getFilter(filter)
    const query: Prisma.JobNoticeFindManyArgs = this.getQueryByCategory(order, category, jobNoticeFilter)

    // 필터링된 jobNotice들
    const tempJobNotices: any[] = await this.repository.getFilteredJobNotices(query)
    const filteredJobNotices: any[] = tempJobNotices.slice(index, difference)

    // response 생성
    const response: GetAllJobNoticeResponseDto = this.getResultList(tempJobNotices.length, filteredJobNotices)

    return response
  }

  // 개별 채용 공고 보기
  async getJobNoticeById(jobId: number): Promise<CreateJobNoticeResponseDto> {
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

    // response 생성
    const response: CreateJobNoticeResponseDto = {
      jobNotice: existedJobNotice,
      companyInfo: company
    }

    // jobNotice의 hits 카운트 올리기
    await this.repository.updateJobNoticeHits(jobId)

    return response
  }

  // 채용 공고 검색
  async searchJobNoticeList(dto: SearchJobNoticeListRequestDto): Promise<GetAllJobNoticeResponseDto> {
    // 쿼리 생성
    const { index, difference, searchWord, order, filter } = dto
    const jobNoticeFilter: Prisma.JobNoticeWhereInput = this.getFilter(filter)
    const query: Prisma.JobNoticeFindManyArgs = this.getQueryBySearchWord(order, searchWord, jobNoticeFilter)

    // 필터링된 jobNotice들
    const tempJobNotices: any[] = await this.repository.getFilteredJobNotices(query)
    const filteredJobNotices: any[] = tempJobNotices.slice(index, difference)

    // response 생성
    const response: GetAllJobNoticeResponseDto = this.getResultList(tempJobNotices.length, filteredJobNotices)

    return response
  }

  // 채용 공고 북마크 추가
  async createBookmarkedJobNotice(jobId: number, userId: string): Promise<BookmarkedJobNotice> {
    // 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedJobNotice: JobNotice | null = await this.repository.getJobNoticeById(jobId)
    if (!existedJobNotice) {
      throw new NotFoundException('존재하지 않는 채용 공고입니다')
    }

    // 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedUser: User | null = await this.userRepository.getUserById(userId)
    if (!existedUser) {
      throw new NotFoundException('존재하지 않는 유저입니다')
    }

    // 존재하는 북마크된 채용 공고인지 확인 -> 에러일 시 400 에러 코드 반환
    const existedBookmarkedJobNotice: BookmarkedJobNotice | null =
      await this.repository.getJBookmarkedJobNoticeByJobIdAndUserID(jobId, userId)
    if (existedBookmarkedJobNotice) {
      throw new BadRequestException('이미 존재하는 북마크된 채용 공고입니다')
    }

    // BookmarkedJobNotice 생성
    return await this.repository.createBookmarkedJobNotice(jobId, userId)
  }

  // 채용 공고 북마크 삭제
  async deleteBookmarkedJobNotice(jobId: number, userId: string): Promise<void> {
    // 존재하는 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedJobNotice: JobNotice | null = await this.repository.getJobNoticeById(jobId)
    if (!existedJobNotice) {
      throw new NotFoundException('존재하지 않는 채용 공고입니다')
    }

    // 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedUser: User | null = await this.userRepository.getUserById(userId)
    if (!existedUser) {
      throw new NotFoundException('존재하지 않는 유저입니다')
    }

    // 존재하는 북마크된 채용 공고인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedBookmarkedJobNotice: BookmarkedJobNotice | null =
      await this.repository.getJBookmarkedJobNoticeByJobIdAndUserID(jobId, userId)
    if (!existedBookmarkedJobNotice) {
      throw new NotFoundException('존재하지 않는 북마크된 채용 공고입니다')
    }

    // BookmarkedJobNotice 삭제
    await this.repository.deleteBookmarkedJobNotice(jobId, userId)
  }

  // 채용 공고 추가
  async createJobNotice(dto: CreateJobNoticeRequestDto): Promise<CreateJobNoticeResponseDto> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedCompany: Company | null = await this.companyRepository.getCompanyById(dto.companyId)
    if (!existedCompany) {
      throw new NotFoundException('존재하지 않는 회사입니다')
    }

    // 채용 공고 중복 처리 -> 에러일 시 400 에러 코드 반환
    const existedJobNotice: JobNotice | null = await this.repository.getJobNoticeByCompanyIdAndTitle(
      dto.companyId,
      dto.title
    )
    if (existedJobNotice) {
      throw new BadRequestException('이미 존재하는 채용 공고입니다.')
    }

    // JobNotice 생성
    const createdJobNotice: JobNotice = await this.repository.createJobNotice(dto)

    // response 생성
    const response: CreateJobNoticeResponseDto = {
      jobNotice: createdJobNotice,
      companyInfo: existedCompany
    }

    return response
  }

  // 채용 공고 수정
  async updateJobNotice(jobId: number, dto: UpdateJobNoticeRequestDto): Promise<CreateJobNoticeResponseDto> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    if (dto.companyId !== undefined) {
      const existedCompany: Company | null = await this.companyRepository.getCompanyById(dto.companyId)
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
    const updateJobNotice: JobNotice = await this.repository.updateJobNotice(jobId, dto)

    // response 생성
    const response: CreateJobNoticeResponseDto = {
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

  // 검색 자동 완성 목록 보기
  async getAutoComplete(): Promise<string[]> {
    const companyNames = await this.companyRepository.getAllCompanyNames()
    const jobNoticeTitles = await this.repository.getAllJobNoticeTitles()
    return [
      ...companyNames.map(companyName => companyName.companyName),
      ...jobNoticeTitles.map(jobNoticeTitle => jobNoticeTitle.title)
    ]
  }
}
