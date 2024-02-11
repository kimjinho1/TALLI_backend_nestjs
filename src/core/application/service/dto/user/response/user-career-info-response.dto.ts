import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'
import { CodefCareerResponseDto } from './codef-career-response.dto'

export class UserCareerInfoResponseDto extends CodefCareerResponseDto {
  @ApiProperty({ description: '임상 직군인지 확인', example: true })
  @IsBoolean()
  @IsNotEmpty()
  isClinical: boolean

  @ApiProperty({ description: '상세 포지션', example: '~~간호사' })
  @IsString()
  @IsNotEmpty()
  position: string
}
