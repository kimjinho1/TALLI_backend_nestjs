import { Injectable } from '@nestjs/common'
import { CurrentJobDetail, Job, JobOfInterest, Prisma, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

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
  async getCurrentJobDetail(userId: string): Promise<CurrentJobDetail> {
    return await this.prisma.currentJobDetail.findUniqueOrThrow({
      where: {
        userId
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

  /** nickname으로 User 찾기 */
  async getUserByNickname(nickname: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        nickname
      }
    })
  }
}
