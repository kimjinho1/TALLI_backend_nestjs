import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BookmarkedJobNotice, JobNotice } from '@prisma/client'
import { JobNoticeService } from 'src/core/application/service/job-notice.service'

@Controller('job-notice')
@ApiTags('채용 공고 API')
export class JobNoticeController {
  constructor(private readonly jobNoticeService: JobNoticeService) {}

  //   @Post('/list')
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOperation({ summary: '전체 채용 공고 보기' })
  //   async getJobNoticeList(@Body() dto: GetJobNoticeListRequestDto): Promise<GetAllJobNoticeResponseDto> {
  //     return await this.jobNoticeService.getAllJobNotice(dto)
  //   }
}
