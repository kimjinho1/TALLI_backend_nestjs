import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateJobNoticeDto, ICreateJobNoticeResponse, UpdateJobNoticeDto } from './dto'
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

  @Patch('/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 수정' })
  async UpdateJobNotice(
    @Param('jobId') jobId: number,
    @Body() updateJobNoticeDto: UpdateJobNoticeDto
  ): Promise<ICreateJobNoticeResponse> {
    return await this.jobNoticeService.updateJobNotice(jobId, updateJobNoticeDto)
  }
}
