import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested, IsIn, IsDefined } from 'class-validator'
import { jobList } from '..'
import { CurrentJobDetailDto } from '../current-job-detaill.dto'
import { UserDto } from '../user.dto'

export class AddUserRequestDto extends UserDto {
  @ApiProperty({ description: '유저 자세한 정보' })
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => CurrentJobDetailDto)
  currentJobDetail: CurrentJobDetailDto

  @ApiProperty({ description: '최대 10개인 문자열 배열', example: ['보건관리자', '임상연구'] })
  @IsDefined()
  @IsIn(jobList, { each: true })
  jobOfInterestList: string[]
}
