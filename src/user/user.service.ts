import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateUserDto } from './dto/CreateUser.dto'
import { UserRepository } from './repository/user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  // 유저 생성
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    // request body에서 현재 직업, 관심 직군, 유저 정보를 분리
    const { currentJobDetail, jobOfInterestList, ...userData } = createUserDto
    // console.log('currentJobDetail:', currentJobDetail)
    // console.log('jobOfInterestList:', jobOfInterestList)
    // console.log('userData:', userData)

    // 닉네임 중복 처리 -> 에러일 시 409 에러 코드 반환
    const tempUser: User | null = await this.repository.getUserByNickname(userData.nickname)
    if (tempUser) {
      throw new HttpException('닉네임이 중복되었습니다.', HttpStatus.CONFLICT)
    }
    const createdUser: User = await this.repository.createUser(userData)
    const createdCurrentJobDetail = await this.repository.createCurrentJobDetail(createdUser.userId, currentJobDetail)
    console.log('createdUser:', createdUser)
    console.log('createdCurrentJobDetail:', createdCurrentJobDetail)
  }
}
