import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CurrentJobDetail, User } from '@prisma/client'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { AddUserInfoCommand, UpdateUserCommand } from 'src/core/adapter/web/command/user'
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

  /** 회원 정보 수정 */
  async updateUser(userId: string, dto: UpdateUserCommand): Promise<UserInfoDto> {
    /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    await this.checkUserDuplicateByNickname(dto.nickname)

    /** 회원 검증과 동시에 회원 정보를 미리 가져옴 */
    let userInfo = await this.getUserInfo(userId)

    /** 회원 정보 업데이트 */
    const updatedUser = await this.repository.updateUser(userId, dto)
    userInfo.nickname = updatedUser.nickname
    userInfo.imageUrl = updatedUser.imageUrl
    return userInfo
  }

  /** 회원 관심 직군 수정 */
  async updateJobOfInterest(userId: string, jobs: string[]): Promise<UserInfoDto> {
    /** 회원 검증과 동시에 회원 정보를 미리 가져옴 */
    let userInfo = await this.getUserInfo(userId)
    const interestedJobs = await this.repository.getJobOfInterestList(userId)

    const jobTitlesToRemove = interestedJobs.filter(job => !jobs.includes(job.title)).map(job => job.title)
    const jobTitlesToAdd = jobs
      .filter(newJob => !interestedJobs.some(job => job.title === newJob))
      .filter(job => !jobTitlesToRemove.includes(job))
    const jobsToAdd = await this.repository.getJobIdsByJobOfInterestList(jobTitlesToAdd)
    const jobIdsToAdd = jobsToAdd.map(job => job.jobId)

    await this.repository.deleteJobOfInterestList(userId, jobTitlesToRemove)
    await this.repository.createJobOfInterestList(userId, jobIdsToAdd)
    const jobOfInterestList = await this.repository.getJobOfInterestList(userId)
    userInfo.jobOfInterestList = jobOfInterestList.map(job => job.title)

    return userInfo
  }

  /** 회원 정보 삭제 */
  async deleteUser(userId: string): Promise<void> {
    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getUser(userId)

    await this.repository.deleteUser(userId)
  }

  /**
   * UTILS
   */

  /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
  public async getUser(userId: string): Promise<User> {
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
  private async checkUserDuplicateByNicknameOrEmail(nickname: string, email: string): Promise<void> {
    const user = await this.repository.getUserByNicknameOrEmail(nickname, email)
    if (user) {
      throw new BadRequestException(ErrorMessages.NICKNAME_OR_EMAIL_ALREADY_EXISTS)
    }
  }

  /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
  private async checkUserDuplicateByNickname(nickname: string): Promise<void> {
    const user = await this.repository.getUserByNickname(nickname)
    if (user) {
      throw new BadRequestException(ErrorMessages.NICKNAME_ALREADY_EXISTS)
    }
  }
}
