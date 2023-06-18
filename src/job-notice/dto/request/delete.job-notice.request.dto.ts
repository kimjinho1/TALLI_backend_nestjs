import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class DeleteJobNoticeRequestDto {
  @ApiProperty({ description: '채용 공고 ID', example: 0 })
  @IsNumber()
  jobId: number
}
