import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'
import { AddUserDto, IAddUserResponse } from './dto'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  // 회원 정보 추가
  async addUser(createUserDto: AddUserDto): Promise<IAddUserResponse> {
    // request body에서 현재 직업, 관심 직군, 유저 정보를 분리
    const { currentJobDetail, jobOfInterestList, ...userData } = createUserDto

    // 닉네임 중복 처리 -> 에러일 시 409 에러 코드 반환
    const existedUser: User | null = await this.repository.getUserByNicknameOrEmail(userData.nickname, userData.email)
    if (existedUser) {
      throw new ConflictException('이미 존재하는 닉네임 또는 이메일입니다')
    }

    // User 생성
    const createdUser: User = await this.repository.createUser(userData)
    // CurrentJobDetail 생성
    const createdCurrentJobDetail: CurrentJobDetail = await this.repository.createCurrentJobDetail(
      createdUser.userId,
      currentJobDetail
    )
    // JobOfInterest 생성
    await this.repository.createJobOfInterestList(createdUser.userId, jobOfInterestList)
    const createdJobOfInterestList: JobOfInterest[] = await this.repository.getJobOfInterest(createdUser.userId)

    // post 결과 반환
    return {
      user: createdUser,
      currentJobDetail: createdCurrentJobDetail,
      jobOfInterest: createdJobOfInterestList
    }
  }

  // 전체 회원 닉네임 목록 보기
  async getAllNickname(): Promise<string[]> {
    const users = await this.repository.getUserList()
    const nicknames = users.map(user => user.nickname)

    return nicknames
  }
}
