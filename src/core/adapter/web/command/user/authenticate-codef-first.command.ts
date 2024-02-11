import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateCodefFirstCommand {
  @ApiProperty({ description: '기관코드', example: '0002' })
  @IsString()
  @IsNotEmpty()
  organization: string

  @ApiProperty({ description: '로그인 구분', example: '5' })
  @IsString()
  @IsNotEmpty()
  loginType: string

  @ApiProperty({ description: '사용자주민번호', example: '19980115' })
  @IsString()
  @IsNotEmpty()
  identity: string

  @ApiProperty({ description: '간편인증 로그인 구분	', example: '1' })
  @IsString()
  @IsNotEmpty()
  loginTypeLevel: string

  @ApiProperty({ description: '사용자 이름', example: '김진호' })
  @IsString()
  @IsNotEmpty()
  userName: string

  @ApiProperty({ description: '통신사', example: '0' })
  @IsString()
  @IsNotEmpty()
  telecom: string

  @ApiProperty({ description: '전화번호', example: '01048478113' })
  @IsString()
  @IsNotEmpty()
  phoneNo: string

  @ApiProperty({ description: '가입자구분(용도구분)', example: '0' })
  @IsString()
  @IsNotEmpty()
  useType: string

  @ApiProperty({ description: '주민번호 뒷자리 공개여부', example: '0' })
  @IsString()
  @IsNotEmpty()
  isIdentityViewYN: string

  @ApiProperty({ description: '원문 DATA 포함 여부', example: '0' })
  @IsString()
  @IsNotEmpty()
  originDataYN: string
}
