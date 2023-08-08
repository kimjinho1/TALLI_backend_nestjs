import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { UserInfoDto } from './dto/user/response'

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

    // 유저의 관심 직종
    const jobOfInterestList = await this.repository.getJobOfInterestList(userId)

    const result = {
      ...existedUser,
      currentJobDetail: currentJobDetail,
      jobOfInterest: jobOfInterestList.map(job => job.title)
    }
    return result
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

  private async getCurrentJobDetail(userId: string): Promise<CurrentJobDetail> {
    try {
      return await this.repository.getCurrentJobDetail(userId)
    } catch (error) {
      throw new NotFoundException(ErrorMessages.CURRENT_JOB_DETAIL_NOT_FOUND)
    }
  }
}
