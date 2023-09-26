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

  async kakaoLogin(kakaoAccessToken: string, res: Response): Promise<any> {
    const oAuthLoginData = await this.httpService.axiosRef.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoAccessToken}` }
    })

    /** 존재하는 유저인지 확인 */
    const existedUser = await this.userRepository.getUserByEmail(oAuthLoginData.data.kakao_account.email)
    if (!existedUser) {
      throw new BadRequestException(ErrorMessages.SIGN_UP_REQUIRED)
    }

    /** 카카오 가입이 되어 있는 경우 accessToken 발급 */
    const existedUserPayload = { sub: existedUser.userId }

    const accessToken = this.jwtService.sign(existedUserPayload)

    /* 쿠키 설정 */
    res.cookie('accessToken', accessToken, {
      httpOnly: true
    })
  }

  //   async kakaoLogin(req: KakaoRequest, res: Response): Promise<KakaoLoginAuthResponseDto> {
  async kakaoPassportLogin(req: KakaoRequest, res: Response): Promise<any> {
    const {
      user: { email, name, accessToken, refreshToken }
    } = req

    /** 존재하는 유저인지 확인 */
    const existedUser = await this.userRepository.getUserByEmail(email)
    console.log('existedUser:', existedUser)
    if (!existedUser) {
      throw new BadRequestException(ErrorMessages.SIGN_UP_REQUIRED)
    }

    /** 카카오 가입이 되어 있는 경우 accessToken 및 refreshToken 발급 */
    const existedUserPayload = { sub: existedUser.userId }
    console.log('existedUserPayload:', existedUserPayload)

    //   const accessToken = this.jwtService.sign(existedUserPayload, {
    //     secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
    //     expiresIn: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
    //   })
    //   const refreshToken = this.jwtService.sign(existedUserPayload, {
    //     secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
    //     expiresIn: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
    //   })
    // console.log('accessToken:', accessToken)
    // console.log('refreshToken:', refreshToken)

    /* 쿠키 설정 */
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true
    // })

    //   throw new UnauthorizedException(ErrorMessages.KAKAO_UNAUTHORIZED)
  }
}
