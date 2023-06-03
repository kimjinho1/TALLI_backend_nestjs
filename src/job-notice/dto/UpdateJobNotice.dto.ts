import { PartialType } from '@nestjs/mapped-types'
import { CreateJobNoticeDto } from './CreateJobNotice.dto'

export class UpdateJobNoticeDto extends PartialType(CreateJobNoticeDto) {}
