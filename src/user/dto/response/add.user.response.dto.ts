import { ApiProperty } from '@nestjs/swagger'
import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'

export class AddUserResponseDto {
  @ApiProperty({ description: 'User' })
  user: User

  @ApiProperty({ description: 'CurrentJobDetail' })
  currentJobDetail: CurrentJobDetail

  @ApiProperty({ description: 'JobOfInterest[]' })
  jobOfInterest: JobOfInterest[]
}
