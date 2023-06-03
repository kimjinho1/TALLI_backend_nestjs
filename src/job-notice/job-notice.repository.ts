import { Injectable } from '@nestjs/common'
import { JobNotice, Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateJobNoticeDto, UpdateJobNoticeDto } from './dto'

@Injectable()
export class JobNoticeRepository {
  constructor(private prisma: PrismaService) {}

  // jobNotice 필터링
  async getFilteredJobNotices(query: Prisma.JobNoticeFindManyArgs): Promise<any> {
    return await this.prisma.jobNotice.findMany(query)
  }

  // jobId로 JobNotice 찾기
  async getJobNoticeById(jobId: number): Promise<JobNotice | null> {
    return await this.prisma.jobNotice.findUnique({
      where: {
        jobId
      }
    })
  }

  // jobId와 공고명으로 JobNotice 찾기
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

  // JobNotice 생성
  async createJobNotice(createJobNoticeDto: CreateJobNoticeDto): Promise<JobNotice> {
    return await this.prisma.jobNotice.create({
      data: {
        ...createJobNoticeDto
      }
    })
  }

  // JobNotice 업데이트
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

  // JobNotice 삭제
  async deleteJobNotice(jobId: number): Promise<JobNotice> {
    return await this.prisma.jobNotice.delete({
      where: {
        jobId
      }
    })
  }
}
