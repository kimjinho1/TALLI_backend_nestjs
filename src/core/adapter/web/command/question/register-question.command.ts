import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator'

export class RegisterQuestionCommandDto {
  @ApiProperty({ description: '현직자 ID', example: 'UUID' })
  @IsUUID()
  partnerId: string

  @ApiProperty({ description: '현재 상황', example: '절망적' })
  @IsString()
  @IsNotEmpty()
  currentStatus: string

  @ApiProperty({ description: '질문 1', example: 'CRA가 하고 싶습니다 선생님...' })
  @IsString()
  @IsNotEmpty()
  @Length(10)
  question1: string

  @ApiProperty({ description: '질문 2', example: 'CRO가 하고 싶습니다 선생님...' })
  @IsString()
  @IsNotEmpty()
  @Length(10)
  question2: string
}
