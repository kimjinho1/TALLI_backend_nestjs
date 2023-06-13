import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CurrentJobDetailDto {
  @ApiProperty({ description: '학년', example: '4' })
  @IsString()
  grade: string

  @ApiProperty({ description: '임상 경력', example: 'example' })
  @IsString()
  activePeriod: string

  @ApiProperty({ description: '탈임상 직업', example: 'example' })
  @IsString()
  escapedJob: string

  @ApiProperty({ description: '탈임상 경력', example: 'example' })
  @IsString()
  escapedPeriod: string

  @ApiProperty({ description: '휴직 기간', example: 'example' })
  @IsString()
  inactivePeriod: string

  @ApiProperty({ description: '기타 직업', example: 'example' })
  @IsString()
  otherJob: string
}
