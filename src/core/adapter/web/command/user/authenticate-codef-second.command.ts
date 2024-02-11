import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator'
import { AuthenticateCodefFirstCommand } from './authenticate-codef-first.command'

export class TwoWayInfo {
  @ApiProperty({ description: '추가 인증 정보, 추가 요청에 사용', example: 0 })
  @IsNumber()
  @Min(0)
  jobIndex: number

  @ApiProperty({ description: '추가 인증 정보, 추가 요청에 사용', example: 0 })
  @IsNumber()
  @Min(0)
  threadIndex: number

  @ApiProperty({ description: '트렌젝션 아이디', example: 'db55392ae72a44efaa394' })
  @IsString()
  @IsNotEmpty()
  jti: string

  @ApiProperty({ description: '추가 인증 시간', example: 15650663 })
  @IsNumber()
  @Min(0)
  twoWayTimestamp: number
}

export class AuthenticateCodefSecondCommand extends AuthenticateCodefFirstCommand {
  @ApiProperty({ description: '"0": cancel , "1": ok', example: '1' })
  @IsString()
  @IsNotEmpty()
  simpleAuth: string

  @ApiProperty({ description: '추가 요청임을 알리는 설정값', example: true })
  @IsBoolean()
  is2Way: boolean

  @ApiProperty({ description: '추가 인증 정보' })
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => TwoWayInfo)
  twoWayInfo: TwoWayInfo
}
