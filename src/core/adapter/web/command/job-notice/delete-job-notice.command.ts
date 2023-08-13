import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class DeleteJobNoticeCommand {
  @ApiProperty({ description: '채용 공고 ID', example: 0 })
  @IsInt()
  @Min(0)
  jobId: number
}
