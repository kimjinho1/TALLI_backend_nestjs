import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsUUID } from 'class-validator'

export class JobUserIdRequestDto {
  @ApiProperty({ description: '채용 공고 ID', example: 0 })
  @IsNumber()
  jobId: number

  @ApiProperty({ description: '유저 ID' })
  @IsUUID()
  userId: string
}
