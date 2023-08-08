import { Injectable } from '@nestjs/common'
import { CurrentJobDetail, Job, JobOfInterest, Prisma, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CurrentJobDetailDto, UserDto } from '../web/command/user'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  /** 모든 유저 반환 */
  async getUserNicknames(): Promise<Pick<User, 'nickname'>[]> {
    return await this.prisma.user.findMany({
      select: {
        nickname: true
      }
    })
  }

  /** id로 User 찾기 */
  async getUser(userId: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        userId
      }
    })
  }

  /** userId에 매칭되는 CurrentJobDetail 반환 */
  async getCurrentJobDetail(userId: string): Promise<Omit<CurrentJobDetail, 'currentJobDetailId' | 'userId'>> {
    return await this.prisma.currentJobDetail.findUniqueOrThrow({
      where: {
        userId
      },
      select: {
        grade: true,
        activePeriod: true,
        escapedJob: true,
        escapedPeriod: true,
        inactivePeriod: true,
        otherJob: true
      }
    })
  }

  /** userId에 매칭되는 모든 JobOfInterest 반환 */
  async getJobOfInterestList(userId: string): Promise<Pick<Job, 'title'>[]> {
    return await this.prisma.job.findMany({
      where: {
        jobOfInterest: {
          some: {
            userId
          }
        }
      },
      select: {
        title: true
      }
    })
  }

  /** nickname or email로 User 찾기 */
  async getUserByNicknameOrEmail(nickname: string, email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ nickname }, { email }]
      }
    })
  }

  /** User 생성 */
  async createUser(userData: UserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...userData
      }
    })
  }

  /** CurrentJobDetail 생성 */
  async createCurrentJobDetail(userId: string, currentJobDetail: CurrentJobDetailDto): Promise<CurrentJobDetail> {
    return await this.prisma.currentJobDetail.create({
      data: {
        userId,
        ...currentJobDetail
      }
    })
  }

  /** JobOfInterest에 매칭되는 jobId들 반환 */
  async getJobIdsByJobOfInterestList(jobOfInterestList: string[]): Promise<Pick<Job, 'jobId'>[]> {
    return await this.prisma.job.findMany({
      where: {
        title: {
          in: jobOfInterestList
        }
      },
      select: {
        jobId: true
      }
    })
  }

  /** JobOfInterest 여러게 한번에 생성 */
  async createJobOfInterestList(userId: string, jobIds: number[]): Promise<void> {
    await this.prisma.jobOfInterest.createMany({
      data: jobIds.map(jobId => ({
        userId,
        jobId
      }))
    })
  }

  /** 유저에 매칭되는 JobOfInterest 반환 */
  async getJobOfInterest(userId: string): Promise<Pick<Job, 'title'>[]> {
    return await this.prisma.job.findMany({
      where: {
        jobOfInterest: {
          some: {
            userId
          }
        }
      }
    })
  }

  /** nickname으로 User 찾기 */
  async getUserByNickname(nickname: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        nickname
      }
    })
  }
}
