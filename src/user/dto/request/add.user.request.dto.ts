import { Type } from 'class-transformer'
import { ValidateNested, IsIn, ArrayNotEmpty, IsDefined } from 'class-validator'
import { CurrentJobDetailDto } from '../current.job.detaill.dto'
import { UserDto } from '../user.dto'

const jobList = [
  '보건관리자',
  '임상연구',
  '보험심사',
  '기획 / 마케팅',
  '공공기관',
  '공무원',
  '메디컬라이터',
  '영업직',
  '정신건강간호사',
  '손해사정사'
]

export class AddUserRequestDto extends UserDto {
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => CurrentJobDetailDto)
  currentJobDetail: CurrentJobDetailDto

  @IsDefined()
  @ArrayNotEmpty()
  @IsIn(jobList, { each: true })
  jobOfInterestList: string[]
}
