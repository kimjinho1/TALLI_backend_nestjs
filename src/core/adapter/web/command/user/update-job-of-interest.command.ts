import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsIn } from 'class-validator'
import { jobList } from 'src/core/application/service/dto/user/response'

export class UpdateJobOfInterestCommand {
  @ApiProperty({ type: [String], description: '최대 10개인 문자열 배열', example: ['보건관리자', '임상연구'] })
  @IsDefined()
  @IsIn(jobList, { each: true })
  jobOfInterestList: string[]
}
