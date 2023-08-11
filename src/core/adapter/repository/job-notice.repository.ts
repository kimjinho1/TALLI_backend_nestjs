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
