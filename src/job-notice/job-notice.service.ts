import { Injectable } from '@nestjs/common'
import { CreateJobNoticeDto } from './dto/CreateJobNotice.dto'
import { JobNoticeRepository } from './repository/job-notice.repository'

@Injectable()
export class JobNoticeService {
  constructor(private readonly repository: JobNoticeRepository) {}

  async createJobNotice(createJobNoticeDto: CreateJobNoticeDto): Promise<void> {
    console.log(createJobNoticeDto)
  }
}
