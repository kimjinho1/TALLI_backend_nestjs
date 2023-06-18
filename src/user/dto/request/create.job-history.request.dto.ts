import { IsUUID } from 'class-validator'
import { CurrentJobDetailDto } from '../current-job-detaill.dto'

export class CreateJobHistoryRequestDto extends CurrentJobDetailDto {
  @IsUUID()
  userId: string
}
