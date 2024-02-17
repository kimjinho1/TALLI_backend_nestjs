import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsIn } from 'class-validator'
import { jobs } from 'src/common/mapper/job-mapper.service'

export class UpdateJobOfInterestCommand {
  @ApiProperty({ type: [String], description: '최대 10개인 문자열 배열', example: ['보건관리자', '임상연구'] })
  @IsDefined()
  @IsIn(jobs, { each: true })
  jobOfInterestList: string[]
}
