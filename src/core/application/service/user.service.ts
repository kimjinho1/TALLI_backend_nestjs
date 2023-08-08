import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { UserInfoDto } from './dto/user/response'
import { AddUserInfoCommand } from 'src/core/adapter/web/command/user'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  /** 전체 회원 닉네임 목록 보기 */
  async getUserNicknames(): Promise<string[]> {
    const nicknames = await this.repository.getUserNicknames()

    const result = nicknames.map(nickname => nickname.nickname)
    return result
  }

  /** 개별 회원 정보 보기 */
  async getUserInfo(userId: string): Promise<UserInfoDto> {
    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const existedUser = await this.getUser(userId)

    /** 존재하는 유저 상세 정보인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const currentJobDetail = await this.getCurrentJobDetail(userId)

    /** 유저의 관심 직종 */
    const jobOfInterestList = await this.repository.getJobOfInterestList(userId)

    const result = {
      ...existedUser,
      currentJobDetail: currentJobDetail,
      jobOfInterestList: jobOfInterestList.map(job => job.title)
    }
    return result
  }

  /** 회원 정보 추가 */
  async addUserInfo(dto: AddUserInfoCommand): Promise<UserInfoDto> {
    /** request body에서 현재 직업, 관심 직군, 유저 정보를 분리 */
    const { currentJobDetail, jobOfInterestList, ...userData } = dto

    /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    await this.checkUserDuplicateByNicknameOrEmail(userData.nickname, userData.email)

    /** 유저 정보 생성 */
    const createdUser = await this.repository.createUser(userData)

    /** 유저 상세 정보 생성 */
    const createdCurrentJobDetailWithUserId = await this.repository.createCurrentJobDetail(
      createdUser.userId,
      currentJobDetail
    )
    const { currentJobDetailId, userId, ...createdCurrentJobDetail } = createdCurrentJobDetailWithUserId

    /** 유저 관심 직군 생성 */
    const jobs = await this.repository.getJobIdsByJobOfInterestList(jobOfInterestList)
    const jobIds = jobs.map(job => job.jobId)
    await this.repository.createJobOfInterestList(createdUser.userId, jobIds)
    const createdJobOfInterestList = await this.repository.getJobOfInterest(createdUser.userId)

    /** post 결과 반환 */
    return {
      ...createdUser,
      currentJobDetail: createdCurrentJobDetail,
      jobOfInterestList: createdJobOfInterestList.map(job => job.title)
    }
  }

  /**
   * UTILS
   */

  /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
  private async getUser(userId: string): Promise<User> {
    try {
      return await this.repository.getUser(userId)
    } catch (error) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)
    }
  }

  /** 존재하는 유저 상세 정보인지 확인 -> 에러일 시 404 에러 코드 반환 */
  private async getCurrentJobDetail(userId: string): Promise<Omit<CurrentJobDetail, 'currentJobDetailId' | 'userId'>> {
    try {
      return await this.repository.getCurrentJobDetail(userId)
    } catch (error) {
      throw new NotFoundException(ErrorMessages.CURRENT_JOB_DETAIL_NOT_FOUND)
    }
  }

  /** 닉네임, 이메일 중복 처리 -> 에러일 시 400 에러 코드 반환 */
  private async checkUserDuplicateByNicknameOrEmail(userId: string, email: string): Promise<void> {
    const user = await this.repository.getUserByNicknameOrEmail(userId, email)
    if (user) {
      throw new BadRequestException(ErrorMessages.NICKNAME_OR_EMAIL_ALREADY_EXISTS)
    }
  }
}
