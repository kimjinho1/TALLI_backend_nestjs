import { PartialType } from '@nestjs/swagger'
import { CreateJobNoticeDto } from './CreateJobNotice.dto'

export class UpdateJobNoticeDto extends PartialType(CreateJobNoticeDto) {}
