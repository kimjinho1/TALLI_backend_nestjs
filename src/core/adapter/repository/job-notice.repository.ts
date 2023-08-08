import { Injectable } from '@nestjs/common'
import { BookmarkedJobNotice, JobNotice, Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class JobNoticeRepository {
  constructor(private prisma: PrismaService) {}

  // jobNotice 필터링
  async getFilteredJobNotices(query: Prisma.JobNoticeFindManyArgs): Promise<any> {
    return await this.prisma.jobNotice.findMany(query)
  }
}
