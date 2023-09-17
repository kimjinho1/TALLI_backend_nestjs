import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'
import { CreateJobNoticeCommand } from 'src/core/adapter/web/command/job-notice'
import { CompanyDto } from '../../company/response'

export class JobNoticeDto extends CreateJobNoticeCommand {
  @ApiProperty({ description: '채용 공고 ID', example: '1' })
  @IsNumber()
  @IsPositive()
  jobNoticeId: number
}

export class JobNoticeInfoDto {
  @ApiProperty({ type: JobNoticeDto, description: '채용 공고 정보' })
  jobNotice: JobNoticeDto

  @ApiProperty({ type: CompanyDto, description: '회사 정보' })
  companyInfo: CompanyDto
}
