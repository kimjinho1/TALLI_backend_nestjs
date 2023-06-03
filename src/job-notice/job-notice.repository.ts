import { Injectable } from '@nestjs/common'
import { JobNotice } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateJobNoticeDto, UpdateJobNoticeDto } from './dto'

@Injectable()
export class JobNoticeRepository {
  constructor(private prisma: PrismaService) {}

  async getJobNoticeById(jobId: number): Promise<JobNotice | null> {
    return await this.prisma.jobNotice.findUnique({
      where: {
        jobId
      }
    })
  }

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

  async updateJobNotice(jobId: number, updateJobNoticeDto: UpdateJobNoticeDto): Promise<JobNotice> {
    return await this.prisma.jobNotice.update({
      where: {
        jobId
      },
      data: {
        ...updateJobNoticeDto
      }
    })
  }
}
