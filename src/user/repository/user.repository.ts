import { Injectable } from '@nestjs/common'
import { CurrentJobDetail, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { UserDto } from '../dto/CreateUser.dto'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(userData: UserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...userData
      },
      include: {
        currentJobDetail: true
      }
    })
  }

  async createUserWithCurrentJobDetail(userData: UserDto, currentJobDetail: CurrentJobDetail): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...userData,
        currentJobDetail: {
          create: currentJobDetail
        }
      },
      include: {
        currentJobDetail: true
      }
    })
  }
}
