import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class AddReviewCommandDto {
  @ApiProperty({ description: '현직자 ID', example: 'UUID' })
  @IsUUID()
  partnerId: string

  @ApiProperty({ description: '질문 ID', example: 1 })
  @IsInt()
  questionId: number

  @ApiProperty({ description: '사용자 리뷰', example: '정말 감사합니다!' })
  @IsString()
  @IsNotEmpty()
  review: string
}
