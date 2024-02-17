import { Injectable } from '@nestjs/common'
import { CurrentJobDetail, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CurrentJobDetailDto, UpdateUserCommand, UserDto } from '../web/command/user'

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

  /** email로 Kakao User 찾기 */
  async getKakaoUser(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        email,
        provider: 'kakao'
      }
    })
  }

  /** email, password로 admin user 찾기 */
  async getAdminUser(email: string, password: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        email,
        password
      }
    })
  }

  /** User Level 조회 */
  async getUserLevel(userId: string): Promise<Pick<User, 'role'>> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        userId
      },
      select: {
        role: true
      }
    })
  }

  /** nickname or email로 User 찾기 */
  async getUserByNicknameOrEmail(nickname: string, email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        AND: [{ nickname }, { email }]
      }
    })
  }

  /** User 생성 */
  async createUser(userData: UserDto, jobIdsCsvString: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...userData,
        jobOfInterest: jobIdsCsvString
      }
    })
  }

  /** Default User 생성 */
  async createDefaultUser(email: string, provider: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: null,
        nickname: '',
        sex: null,
        age: null,
        email,
        imageUrl: null,
        role: 'USER',
        currentJob: '',
        provider,
        jobOfInterest: ''
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

  /** nickname으로 User 찾기 */
  async getUserByNickname(nickname: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        nickname
      }
    })
  }

  /** 회원 프로필 수정 */
  async updateUser(userId: string, dto: UserDto, jobIdsCsvString: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        userId
      },
      data: {
        ...dto,
        jobOfInterest: jobIdsCsvString
      }
    })
  }

  /** 회원 codef 인증 경력 내용 업데이트 */
  async updateUserCareerInfo(userId: string, career: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        userId
      },
      data: {
        career
      }
    })
  }

  async updateUserProfile(userId: string, dto: UpdateUserCommand): Promise<User> {
    return await this.prisma.user.update({
      where: {
        userId
      },
      data: {
        ...dto
      }
    })
  }

  /** userId에 매칭되는 유저 정보 삭제 */
  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        userId
      }
    })
  }
}
