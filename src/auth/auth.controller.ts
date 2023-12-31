import { Body, Controller, Get, NotFoundException, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { AuthService } from './auth.service'

type KakaoUser = {
  email: string
  name: string
  accessToken: string
  refreshToken: string
}

type Token = {
  kakaoAccessToken: string
}

type AdminLoginCommand = {
  email: string
  password: string
}

export type KakaoRequest = Request & { user: KakaoUser }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async kakaoLogin(@Body() token: Token, @Res() res: Response) {
    const kakaoAccessToken = token.kakaoAccessToken
    if (!kakaoAccessToken) {
      throw new NotFoundException('not found token')
    }
    await this.authService.kakaoLogin(kakaoAccessToken, res)
  }

  @Post('admin-login')
  async adminLogin(@Body() body: AdminLoginCommand, @Res() res: Response) {
    const { email, password } = body
    const accessToken = await this.authService.adminLogin(email, password)

    res.cookie('accessToken', accessToken, {
      httpOnly: true
    })
    res.json('SIGN_IN').status(200)
  }

  @Get('login')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin1(@Req() req: Request) {}

  @Get('callback')
  @UseGuards(AuthGuard('kakao'))
  // async kakaoAuthCallback(@Req() req: KakaoRequest, @Res({ passthrough: true }) res: Response): Promise<any> {
  async kakaoAuthCallback(@Req() req: KakaoRequest, @Res() res: Response): Promise<any> {
    const kakaoAccessToken = req.user.accessToken

    // await this.authService.kakaoLogin(kakaoAccessToken, res)
    const accessToken = await this.authService.kakaoPassportLogin(req)

    res.cookie('accessToken', accessToken, {
      httpOnly: true
    })
    res.json('SIGN_IN').status(200)
  }
}
