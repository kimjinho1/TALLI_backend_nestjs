import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CurrentJobDetail, User } from '@prisma/client'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { JobMapperService } from 'src/common/mapper/job-mapper.service'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import {
  AddUserCareerInfoDto,
  AddUserInfoCommand,
  AuthenticateCodefFirstCommand,
  AuthenticateCodefSecondCommand,
  TwoWayInfo,
  UpdateUserCommand
} from 'src/core/adapter/web/command/user'
import { StorageService } from 'src/storage/storage.service'
import { CodefCareerResponseDto, UserCareerInfoResponseDto, UserInfoDto } from './dto/user/response'

type codefAccessToken = {
  token: string
  timeStamp: number
}

@Injectable()
export class UserService {
  private encodedAuthString: string
  private codefAccessToken: codefAccessToken

  constructor(
    private readonly repository: UserRepository,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly jobMapperService: JobMapperService
  ) {
    const CODEF_ID = this.configService.get<string>('CODEF_ID')
    const CODEF_PASSWORD = this.configService.get<string>('CODEF_PASSWORD')
    this.encodedAuthString = btoa(`${CODEF_ID}:${CODEF_PASSWORD}`)
    this.codefAccessToken = {
      token: '',
      timeStamp: 0
    }
  }

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
    const jobIds = existedUser.jobOfInterest.split(',').map(Number)
    const jobNames = this.jobMapperService.getJobNames(jobIds)

    const result = {
      ...existedUser,
      currentJobDetail: currentJobDetail,
      jobOfInterestList: jobNames
    }

    return result
  }

  /** 회원 정보 추가 */
  async addUserInfo(dto: AddUserInfoCommand): Promise<UserInfoDto> {
    /** request body에서 현재 직업, 관심 직군, 유저 정보를 분리 */
    const { currentJobDetail, jobOfInterestList, ...userData } = dto

    /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    await this.checkUserDuplicateByNicknameOrEmail(userData.nickname, userData.email)

    /** 유저 관심 직군 생성 */
    const jobIds = this.jobMapperService.getJobIds(jobOfInterestList)
    const jobIdsCsvString = jobIds.join(',')

    /** 유저 정보 생성 */
    const createdUser = await this.repository.createUser(userData, jobIdsCsvString)

    /** 유저 상세 정보 생성 */
    const createdCurrentJobDetailWithUserId = await this.repository.createCurrentJobDetail(
      createdUser.userId,
      currentJobDetail
    )
    const { currentJobDetailId, userId, ...createdCurrentJobDetail } = createdCurrentJobDetailWithUserId

    const result = {
      ...createdUser,
      currentJobDetail: createdCurrentJobDetail,
      jobOfInterestList
    }

    return result
  }

  /** admin 회원 정보 추가 */
  async addAdminUser(dto: any): Promise<User> {
    const userData = dto
    userData.provider = 'none'
    /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    await this.checkUserDuplicateByNicknameOrEmail(userData.nickname, userData.email)

    /** admin 유저 정보 생성 */
    return await this.repository.createUser(userData, '')
  }

  /** 회원 정보 추가 */
  async updateUserInfo(id: string, dto: AddUserInfoCommand): Promise<UserInfoDto> {
    /** request body에서 현재 직업, 관심 직군, 유저 정보를 분리 */
    const { currentJobDetail, jobOfInterestList, ...userData } = dto

    /** 유저 관심 직군 생성 */
    const jobIds = this.jobMapperService.getJobIds(jobOfInterestList)
    const jobIdsCsvString = jobIds.join(',')
    console.log(jobIdsCsvString)

    /** 유저 정보 업데이트 */
    const updatedUser = await this.repository.updateUser(id, userData, jobIdsCsvString)

    /** 유저 상세 정보 생성 */
    const createdCurrentJobDetailWithUserId = await this.repository.createCurrentJobDetail(
      updatedUser.userId,
      currentJobDetail
    )
    const { currentJobDetailId, userId, ...createdCurrentJobDetail } = createdCurrentJobDetailWithUserId

    const result = {
      ...updatedUser,
      jobOfInterestList,
      currentJobDetail: createdCurrentJobDetail
    }

    return result
  }

  /** 회원 정보 수정 */
  async updateUser(userId: string, dto: UpdateUserCommand): Promise<UserInfoDto> {
    /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    await this.checkUserDuplicateByNickname(dto.nickname)

    /** 회원 검증과 동시에 회원 정보를 미리 가져옴 */
    let userInfo = await this.getUserInfo(userId)

    /** 회원 정보 업데이트 */
    const updatedUser = await this.repository.updateUserProfile(userId, dto)
    userInfo.nickname = updatedUser.nickname
    userInfo.imageUrl = updatedUser.imageUrl

    return userInfo
  }

  /** 회원 관심 직군 수정 */
  async updateJobOfInterest(userId: string, jobs: string[]): Promise<UserInfoDto> {
    /** 회원 검증과 동시에 회원 정보를 미리 가져옴 */
    let userInfo = await this.getUserInfo(userId)
    // const interestedJobs = await this.repository.getJobOfInterestList(userId)

    // const jobTitlesToRemove = interestedJobs.filter(job => !jobs.includes(job.title)).map(job => job.title)
    // const jobTitlesToAdd = jobs
    //   .filter(newJob => !interestedJobs.some(job => job.title === newJob))
    //   .filter(job => !jobTitlesToRemove.includes(job))
    // const jobsToAdd = await this.repository.getJobIdsByJobOfInterestList(jobTitlesToAdd)
    // const jobIdsToAdd = jobsToAdd.map(job => job.jobId)

    // await this.repository.deleteJobOfInterestList(userId, jobTitlesToRemove)
    // await this.repository.createJobOfInterestList(userId, jobIdsToAdd)

    // const jobOfInterestList = await this.repository.getJobOfInterestList(userId)
    // userInfo.jobOfInterestList = jobOfInterestList.map(job => job.title)
    userInfo.jobOfInterestList = []

    return userInfo
  }

  /** 회원 정보 삭제 */
  async deleteUser(userId: string): Promise<void> {
    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const user = await this.getUser(userId)
    if (user.imageUrl) {
      await this.storageService.delete(user.imageUrl)
    }

    await this.repository.deleteUser(userId)
  }

  /**
   * Career
   */

  /** CODEF access token 갱신 => 7일 주기여서 6일 주기로 갱신시킴 */
  async refreshCodefAccessToken(): Promise<void> {
    // 비교 대상 시각 (6일 전)
    const currentTime = new Date().getTime()
    const sixDaysInMilliseconds = 6 * 24 * 60 * 60 * 1000
    const targetTime = currentTime - sixDaysInMilliseconds

    const { token } = this.codefAccessToken

    // 초기여서 토큰이 없거나 6일 이상이 지났는지 비교
    if (!token || this.codefAccessToken.timeStamp < targetTime) {
      this.codefAccessToken.token = await this.getCodefAccessToken()
      this.codefAccessToken.timeStamp = currentTime
    }
  }

  /** codef 1차 인증 */
  async authenticateCodefFirst(userId: string, dto: AuthenticateCodefFirstCommand): Promise<TwoWayInfo> {
    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getUser(userId)

    try {
      const {
        result: { code, message },
        data
      } = await this.fetchAuthenticateCodef(dto)

      /** 실패인 경우 */
      if (code !== 'CF-03002') {
        const replacedMessage = message.replace(/\+/g, ' ').trim()
        throw new BadRequestException(replacedMessage)
      }

      /** 성공 시 2차 인증 때 필요한 정보 반환 */
      const { jobIndex, threadIndex, jti, twoWayTimestamp } = data
      return { jobIndex, threadIndex, jti, twoWayTimestamp }
    } catch (e) {
      throw e
    }
  }

  /** codef 2차 인증 */
  async authenticateCodefSecond(
    userId: string,
    dto: AuthenticateCodefSecondCommand
  ): Promise<CodefCareerResponseDto[]> {
    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getUser(userId)

    try {
      const {
        result: { code, message },
        data
      } = await this.fetchAuthenticateCodef(dto)

      /** 실패인 경우 */
      if (code !== 'CF-00000') {
        const replacedMessage = message.replace(/\+/g, ' ').trim()
        throw new BadRequestException(replacedMessage)
      }

      const userCareerInfo: CodefCareerResponseDto[] = []
      for (const career of data) {
        const { resJoinUserType, resCompanyNm: companyName, commStartDate: startDate, resIssueDate: endDate } = career
        if (resJoinUserType !== '직장가입자') {
          continue
        }
        userCareerInfo.push({ companyName, startDate: startDate.toString(), endDate: endDate.toString() })
      }

      /** 성공 시 유저 경력 정보들 반환 */
      return userCareerInfo
    } catch (e) {
      throw e
    }
  }

  /** 유저의 인증된 경력 정보 저장 */
  async getUserCareerInfo(userId: string): Promise<UserCareerInfoResponseDto[]> {
    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const { career } = await this.getUser(userId)

    /** 인증된 경력 정보가 없는 경우 */
    if (career === null) {
      return []
    }

    /** 유저 경력 정보를 json으로 변환(str => json) */
    const parsedCareerInfo = JSON.parse(career)

    return parsedCareerInfo
  }

  /** 유저의 인증된 경력 정보 조회 */
  async addUserCareerInfo(userId: string, dto: AddUserCareerInfoDto): Promise<User> {
    /** 존재하는 유저인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getUser(userId)

    /** 유저 경력 정보를 문자열로 변환(json => str) */
    const career = JSON.stringify(dto.data)

    const updatedUser = await this.repository.updateUserCareerInfo(userId, career)

    return updatedUser
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

  /** CODEF access token 저장 */
  private async getCodefAccessToken(): Promise<string> {
    const url = 'https://oauth.codef.io/oauth/token'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${this.encodedAuthString}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'read'
      })
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      const { access_token } = data
      if (!access_token) {
        throw new BadRequestException(ErrorMessages.ADMIN_USER_NOT_FOUND)
      }
      return access_token
    } catch (error) {
      throw error
    }
  }

  /** Codef 인증 요청 POST */
  private async fetchAuthenticateCodef(
    dto: AuthenticateCodefFirstCommand | AuthenticateCodefSecondCommand
  ): Promise<any> {
    await this.refreshCodefAccessToken()

    const { token: codefAccessToken } = this.codefAccessToken

    const url = 'https://development.codef.io/v1/kr/public/pp/nhis-join/identify-confirmation'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${codefAccessToken}`
      },
      body: JSON.stringify(dto)
    }

    const response = await fetch(url, options)
    const responseData = await response.text() // Response를 텍스트로 변환
    const decodedData = decodeURIComponent(responseData) // URL 디코드
    const res = JSON.parse(decodedData)

    return res
  }
}
