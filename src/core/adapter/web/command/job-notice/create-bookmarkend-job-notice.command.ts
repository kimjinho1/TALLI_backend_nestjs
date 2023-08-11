import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsUUID, Min } from 'class-validator'

export class createBookmarkedJobNoticeCommand {
  @ApiProperty({ description: '채용 공고 ID', example: 0 })
  @IsInt()
  @Min(0)
  jobId: number

  @ApiProperty({ description: '유저 ID', example: 'UUID' })
  @IsUUID()
  userId: string
}
