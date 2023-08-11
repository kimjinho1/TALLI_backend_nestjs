import { Injectable } from '@nestjs/common'
import { BookmarkedJobNotice, JobNotice, Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { FilteredJobNoticeListDto } from './dto/job-notice'
import { CreateJobNoticeCommand } from '../web/command/job-notice'

@Injectable()
export class JobNoticeRepository {
  constructor(private prisma: PrismaService) {}

  /** jobNotice 필터링 */
  async getFilteredJobNotices(query: Prisma.JobNoticeFindManyArgs): Promise<FilteredJobNoticeListDto> {
    return await this.prisma.jobNotice.findMany({
      ...query,
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
    })
  }

  /** jobId로 JobNotice 찾기 */
  async getJobNotice(jobId: number): Promise<JobNotice> {
    return await this.prisma.jobNotice.findFirstOrThrow({
      where: {
        jobNoticeId: jobId
      }
    })
  }

  /** jobNotice의 hits 카운트 올리기 */
  async updateJobNoticeHits(jobId: number): Promise<void> {
    await this.prisma.jobNotice.update({
      where: {
        jobNoticeId: jobId
      },
      data: {
        hits: {
          increment: 1
        }
      }
    })
  }

  /** jobId와 userId로 JobNotice 찾기 */
  async getBookmarkedJobNotice(jobId: number, userId: string): Promise<BookmarkedJobNotice | null> {
    return await this.prisma.bookmarkedJobNotice.findFirst({
      where: {
        AND: {
          jobNoticeId: jobId,
          userId
        }
      }
    })
  }

  /** BookmarkedJobNotice 생성 */
  async createBookmarkedJobNotice(jobId: number, userId: string): Promise<BookmarkedJobNotice> {
    return await this.prisma.bookmarkedJobNotice.create({
      data: {
        jobNoticeId: jobId,
        userId
      }
    })
  }

  /** jobId와 공고명으로 JobNotice 찾기 */
  async getJobNoticeByCompanyIdAndTitle(companyId: number, title: string): Promise<JobNotice | null> {
    return await this.prisma.jobNotice.findFirst({
      where: {
        AND: {
          companyId,
          title
        }
      }
    })
  }

  /** 채용 공고 생성 */
  async createJobNotice(dto: CreateJobNoticeCommand): Promise<JobNotice> {
    return await this.prisma.jobNotice.create({
      data: {
        ...dto,
        modifiedAt: null
      }
    })
  }
}
