import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsDefined, IsIn } from 'class-validator'
import { jobList } from '..'

export class updateJobOfInterestRequestDto {
  @ApiProperty({ type: [String], description: '최대 10개인 문자열 배열', example: ['보건관리자', '임상연구'] })
  @IsDefined()
  @IsIn(jobList, { each: true })
  jobOfInterestList: string[]
}
