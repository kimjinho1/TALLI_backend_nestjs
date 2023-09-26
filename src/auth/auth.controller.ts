import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { AuthService } from './auth.service'

type KakaoUser = {
  email: string
  name: string
  accessToken: string
  refreshToken: string
}

export type KakaoRequest = Request & { user: KakaoUser }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@Req() req: Request) {}

  @Get('callback')
  @UseGuards(AuthGuard('kakao'))
  // async kakaoAuthCallback(@Req() req: KakaoRequest, @Res({ passthrough: true }) res: Response): Promise<any> {
  async kakaoAuthCallback(@Req() req: KakaoRequest, @Res() res: Response): Promise<any> {
    const kakaoAccessToken = req.user.accessToken
    console.log(kakaoAccessToken)

    // const accessToken = await this.authService.kakaoLogin(kakaoAccessToken)
    const accessToken = await this.authService.kakaoPassportLogin(req)

    /* 쿠키 설정 */
    res.cookie('accessToken', accessToken, {
      httpOnly: true
    })

    res.status(301).redirect(`${process.env.BACKEND_URL}`)
  }
}
