import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateJobNoticeDto, ICreateJobNoticeResponse } from './dto/CreateJobNotice.dto'
import { JobNoticeService } from './job-notice.service'

@Controller('job-notice')
@ApiTags('채용 공고 API')
export class JobNoticeController {
  constructor(private readonly jobNoticeService: JobNoticeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 추가' })
  async createJobNotice(@Body() createJobNoticeDto: CreateJobNoticeDto): Promise<ICreateJobNoticeResponse> {
    return await this.jobNoticeService.createJobNotice(createJobNoticeDto)
  }
}
