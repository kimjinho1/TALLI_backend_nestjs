import { Injectable } from '@nestjs/common'
import { JobNotice } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateJobNoticeDto } from './dto'

@Injectable()
export class JobNoticeRepository {
  constructor(private prisma: PrismaService) {}

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

  async createJobNotice(createJobNoticeDto: CreateJobNoticeDto): Promise<JobNotice> {
    return await this.prisma.jobNotice.create({
      data: {
        ...createJobNoticeDto
      }
    })
  }
}
