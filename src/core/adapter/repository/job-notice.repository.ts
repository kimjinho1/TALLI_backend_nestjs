import { Injectable } from '@nestjs/common'
import { BookmarkedJobNotice, JobNotice, Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateJobNoticeCommand, UpdateJobNoticeCommand } from '../web/command/job-notice'
import { FilteredJobNoticeListDto } from './dto/job-notice'

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
        bookmarks: true,
        company: {
          select: {
            companyName: true,
            logoUrl: true
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
  async incrementHits(jobId: number): Promise<void> {
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

  /** jobNotice의 bookmarks 카운트 올리기 */
  async incrementBookmarks(jobId: number): Promise<void> {
    await this.prisma.jobNotice.update({
      where: {
        jobNoticeId: jobId
      },
      data: {
        bookmarks: {
          increment: 1
        }
      }
    })
  }

  /** jobNotice의 bookmarks 카운트 올리기 */
  async decrementBookmarks(jobId: number): Promise<void> {
    await this.prisma.jobNotice.update({
      where: {
        jobNoticeId: jobId
      },
      data: {
        bookmarks: {
          decrement: 1
        }
      }
    })
  }

  /** jobId와 userId로 북마크된 채용 공고 찾기 */
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

  /** 북마크된 채용 공고 생성 */
  async createBookmarkedJobNotice(jobId: number, userId: string): Promise<BookmarkedJobNotice> {
    return await this.prisma.bookmarkedJobNotice.create({
      data: {
        jobNoticeId: jobId,
        userId
      }
    })
  }

  /** 북마크된 채용 공고 삭제 */
  async deleteBookmarkedJobNotice(jobId: number, userId: string): Promise<void> {
    await this.prisma.bookmarkedJobNotice.deleteMany({
      where: {
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

  /** JobNotice 업데이트 */
  async updateJobNotice(jobId: number, updateJobNoticeDto: UpdateJobNoticeCommand): Promise<JobNotice> {
    return await this.prisma.jobNotice.update({
      where: {
        jobNoticeId: jobId
      },
      data: {
        ...updateJobNoticeDto
      }
    })
  }

  /** JobNotice 삭제 */
  async deleteJobNotice(jobId: number): Promise<JobNotice> {
    return await this.prisma.jobNotice.delete({
      where: {
        jobNoticeId: jobId
      }
    })
  }

  /** 모든 채용 공고명 가져오기 */
  async getAllJobNoticeTitles(): Promise<Pick<JobNotice, 'title'>[]> {
    return await this.prisma.jobNotice.findMany({
      select: {
        title: true
      }
    })
  }
}
