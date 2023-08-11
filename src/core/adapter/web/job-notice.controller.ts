import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BookmarkedJobNotice, JobNotice } from '@prisma/client'
import { JobNoticeService } from 'src/core/application/service/job-notice.service'
import { GetJobNoticeListCommand } from './command/job-notice'
import { JobNoticeListDto } from 'src/core/application/service/dto/job-notice/response'

@Controller('job-notice')
@ApiTags('채용 공고 API')
export class JobNoticeController {
  constructor(private readonly jobNoticeService: JobNoticeService) {}

  @Post('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '전체 채용 공고 보기' })
  async getJobNoticeList(@Body() dto: GetJobNoticeListCommand): Promise<JobNoticeListDto> {
    return await this.jobNoticeService.getAllJobNotice(dto)
  }
}
