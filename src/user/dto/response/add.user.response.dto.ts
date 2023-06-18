import { ApiProperty } from '@nestjs/swagger'
import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'
import { UserDto } from '../user.dto'

export class AddUserResponseDto extends UserDto {
  @ApiProperty({ description: 'CurrentJobDetail' })
  currentJobDetail: CurrentJobDetail

  @ApiProperty({ description: 'JobOfInterest[]' })
  jobOfInterest: JobOfInterest[]
}
