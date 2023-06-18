import { Injectable } from '@nestjs/common'
import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CurrentJobDetailDto, UserDto } from './dto'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  // id로 User 찾기
  async getUserById(userId: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        userId
      }
    })
  }

  // nickname or email로 User 찾기
  async getUserByNicknameOrEmail(nickname: string, email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ nickname }, { email }]
      }
    })
  }

  // nickname or email로 User 찾기
  async getJobOfInterest(userId: string): Promise<JobOfInterest[]> {
    return await this.prisma.jobOfInterest.findMany({
      where: {
        userId
      }
    })
  }

  // 모든 유저 반환
  async getUserList(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  // userId에 매칭되는 CurrentJobDetail 반환
  async getCurrentJobDetailByUserId(userId: string): Promise<CurrentJobDetail | null> {
    return await this.prisma.currentJobDetail.findUnique({
      where: {
        userId
      }
    })
  }

  // userId에 매칭되는 모든 JobOfInterest 반환
  async getJobOfInterestListByUserId(userId: string): Promise<JobOfInterest[]> {
    return await this.prisma.jobOfInterest.findMany({
      where: {
        userId
      }
    })
  }

  // User 생성
  async createUser(userData: UserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...userData
      }
    })
  }

  // CurrentJobDetail 생성
  async createCurrentJobDetail(userId: string, currentJobDetail: CurrentJobDetailDto): Promise<CurrentJobDetail> {
    return await this.prisma.currentJobDetail.create({
      data: {
        userId,
        ...currentJobDetail
      }
    })
  }

  // JobOfInterest 여러게 한번에 생성
  async createJobOfInterestList(userId: string, jobOfInterestList: string[]): Promise<void> {
    await this.prisma.jobOfInterest.createMany({
      data: jobOfInterestList.map(jobOfInterest => ({
        userId,
        jobOfInterest
      }))
    })
  }
}
