import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'

export interface AddUserResponseDto {
  user: User
  currentJobDetail: CurrentJobDetail
  jobOfInterest: JobOfInterest[]
}
