import { Injectable } from '@nestjs/common'
import { CurrentJobDetail, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CurrentJobDetailDto, UserDto } from '../dto/CreateUser.dto'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  // nickname으로 User 찾기
  async getUserByNickname(nickname: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        nickname: nickname
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
}
