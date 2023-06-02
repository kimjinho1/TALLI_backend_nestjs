import { Injectable } from '@nestjs/common'
import { JobNoticeRepository } from './repository/job-notice.repository'

@Injectable()
export class JobNoticeService {
  constructor(private readonly repository: JobNoticeRepository) {}
}
