import { PartialType } from '@nestjs/mapped-types'
import { CreateJobNoticeCommand } from './create-job-notice.command'

export class UpdateJobNoticeCommand extends PartialType(CreateJobNoticeCommand) {}
