import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BookmarkedJobNotice, Company, JobNotice, Prisma, User } from '@prisma/client'
import { CompanyRepository } from 'src/core/adapter/repository/company.repository'
import { JobNoticeRepository } from 'src/core/adapter/repository/job-notice.repository'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { JobNoticeListDto } from './dto/job-notice/response'
import { FilterDto, GetJobNoticeListCommand } from 'src/core/adapter/web/command/job-notice'

@Injectable()
export class JobNoticeService {
  constructor(
    private readonly repository: JobNoticeRepository,
    private readonly companyRepository: CompanyRepository,
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
      where: category !== '전체' ? { category, ...jobNoticeFilter } : jobNoticeFilter,
      select: {
        jobNoticeId: true,
        title: true,
        titleImageUrl: true,
        jobLocation: true,
        experience: true,
        deadline: true,
        hits: true,
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
}
