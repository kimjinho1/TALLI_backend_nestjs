import { PartialType } from '@nestjs/mapped-types'
import { CreateJobNoticeRequestDto } from './create.job-notice.request.dto'

export class UpdateJobNoticeRequestDto extends PartialType(CreateJobNoticeRequestDto) {}
