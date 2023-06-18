import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'
import { AddUserRequestDto, UpdateUserRequestDto } from './dto/request'
import { AddUserResponseDto } from './dto/response'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  // 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환
  private async validateUserByUserId(userId: string): Promise<User> {
    const existedUser: User | null = await this.repository.getUserById(userId)
    if (!existedUser) {
      throw new NotFoundException('존재하지 않는 유저입니다')
    }
    return existedUser
  }

  // 전체 회원 닉네임 목록 보기
  async getAllNickname(): Promise<string[]> {
    const users = await this.repository.getUserList()
    const nicknames = users.map(user => user.nickname)

    return nicknames
  }

  // 개별 회원 정보 보기
  async getUserById(userId: string): Promise<AddUserResponseDto> {
    // 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedUser: User = await this.validateUserByUserId(userId)

    // 존재하는 유저 상세 정보인지 확인 -> 에러일 시 404 에러 코드 반환
    const currentJobDetail: CurrentJobDetail | null = await this.repository.getCurrentJobDetailByUserId(userId)
    if (!currentJobDetail) {
      throw new NotFoundException('존재하지 않는 유저 상제 정보입니다')
    }

    // 유저의 관심 직종
    const jobOfInterestList: JobOfInterest[] = await this.repository.getJobOfInterestListByUserId(userId)
    return {
      ...existedUser,
      currentJobDetail: currentJobDetail,
      jobOfInterest: jobOfInterestList
    }
  }

  // 회원 정보 추가
  async addUser(createUserDto: AddUserRequestDto): Promise<AddUserResponseDto> {
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
      ...createdUser,
      currentJobDetail: createdCurrentJobDetail,
      jobOfInterest: createdJobOfInterestList
    }
  }

  // 회원 정보 추가
  async updateUser(userId: string, dto: UpdateUserRequestDto): Promise<AddUserResponseDto> {
    // 회원 검증과 동시에 회원 정보를 미리 가져옴
    let response: AddUserResponseDto = await this.getUserById(userId)

    const updatedUser: User = await this.repository.updateUser(userId, dto)
    response.nickname = updatedUser.nickname
    response.imageUrl = updatedUser.imageUrl
    return response
  }
}
