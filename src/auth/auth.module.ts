import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'prisma/prisma.service'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt/jwt.strategy'
import { KakaoStrategy } from './kakao/kakao.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'kakao' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
        }
      })
    }),
    HttpModule
  ],
  providers: [KakaoStrategy, AuthService, PrismaService, UserRepository, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
