import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { KakaoRequest } from './auth.controller'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  /** accessToken 생성 */
  private _generateAccessToken(userId: string): string {
    const existedUserPayload = { sub: userId }
    const accessToken = this.jwtService.sign(existedUserPayload)

    return accessToken
  }

  async kakaoLogin(kakaoAccessToken: string, provider: string, res: Response): Promise<void> {
    /** oAuthLoginData.data 양식
    {
      profile_nickname_needs_agreement: false,
      profile: { nickname: '김진호' },
      has_email: true,
      email_needs_agreement: false,
      is_email_valid: true,
      is_email_verified: true,
      email: 'rlawlsgh8113@naver.com'
    }
    */
    const oAuthLoginData = await this.httpService.axiosRef.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoAccessToken}` }
    })

    const { email } = oAuthLoginData.data.kakao_account

    /**
     * 이메일로 한 번이라도 로그인한 유저인지 확인
     * 아닌 경우 -> 유저 default 데이터 생성 후, 회원 가입 페이지로 이동
     */
    // const existedUser = await this.userRepository.getKakaoUser(email)
    const existedUser = await this.userRepository.getKakaoUser(email)
    if (!existedUser) {
      const newUser = await this.userRepository.createDefaultUser(email, provider)
      const accessToken = this._generateAccessToken(newUser.userId)

      /* 쿠키 설정 */
      res.cookie('accessToken', accessToken, {
        httpOnly: true
      })

      res.status(200).json({ status: 'SIGNIN' })
      return
    }

    /** accessToken 발급 */
    const accessToken = this._generateAccessToken(existedUser.userId)

    /* 쿠키 설정 */
    res.cookie('accessToken', accessToken, {
      httpOnly: true
    })

    /** 회원 가입 도중 이탈하여 유저 정보가 없는 경우 -> 회원 가입 페이지로 이동 */
    if (existedUser.nickname === '') {
      res.status(200).json({ status: 'SIGNIN' })
      return
    }

    res.status(200).json({ status: 'OK' })
  }

  async adminLogin(email: string, password: string): Promise<string> {
    try {
      const existedAdminUser = await this.userRepository.getAdminUser(email, password)
      const accessToken = this._generateAccessToken(existedAdminUser.userId)

      return accessToken
    } catch (error) {
      throw new BadRequestException(ErrorMessages.ADMIN_USER_NOT_FOUND)
    }
  }

  // async kakaoPassportLogin(req: KakaoRequest): Promise<any> {
  //   const email = req.user.email
  //   // const {
  //   //   user: { email, name, accessToken, refreshToken }
  //   // } = req

  //   /** 존재하는 유저인지 확인 */
  //   const existedUser = await this.userRepository.getUserByEmail(email)
  //   if (!existedUser) {
  //     throw new BadRequestException(ErrorMessages.SIGN_UP_REQUIRED)
  //   }

  //   /** 카카오 가입이 되어 있는 경우 accessToken 발급 */
  //   const existedUserPayload = { sub: existedUser.userId }
  //   const accessToken = this.jwtService.sign(existedUserPayload)

  //   return accessToken
  // }
}
