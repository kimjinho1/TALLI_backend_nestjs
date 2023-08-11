import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { JobNoticeService } from 'src/core/application/service/job-notice.service'
import { CreateJobNoticeCommand, GetJobNoticeListCommand } from './command/job-notice'
import { JobNoticeInfoDto, JobNoticeListDto } from 'src/core/application/service/dto/job-notice/response'

@ApiTags('채용 공고 API')
@Controller('job-notice')
export class JobNoticeController {
  constructor(private readonly jobNoticeService: JobNoticeService) {}

  @ApiOperation({ summary: '전체 채용 공고 보기', description: '매칭되는 채용 공고들의 정보를 반환합니다.' })
  @ApiBody({ type: GetJobNoticeListCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: JobNoticeListDto
  })
  @Post('/list')
  async getJobNoticeList(@Body() dto: GetJobNoticeListCommand): Promise<JobNoticeListDto> {
    return await this.jobNoticeService.getAllJobNotice(dto)
  }

  @ApiOperation({ summary: '채용 공고 추가' })
  @ApiBody({ type: CreateJobNoticeCommand })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.',
    type: JobNoticeInfoDto
  })
  @ApiBadRequestResponse({
    description: '중복된 채용 공고인 경우, 400 Bad Request 를 응답합니다.'
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createJobNotice(@Body() dto: CreateJobNoticeCommand): Promise<JobNoticeInfoDto> {
    return await this.jobNoticeService.createJobNotice(dto)
  }
}
