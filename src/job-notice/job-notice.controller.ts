import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JobNotice } from '@prisma/client'
import {
  CreateJobNoticeDto,
  GetJobNoticeListDto,
  ICreateJobNoticeResponse,
  IGetAllJobNoticeResponse,
  SearchJobNoticeListDto,
  UpdateJobNoticeDto
} from './dto'
import { JobNoticeService } from './job-notice.service'

@Controller('job-notice')
@ApiTags('채용 공고 API')
export class JobNoticeController {
  constructor(private readonly jobNoticeService: JobNoticeService) {}

  @Post('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '전체 채용 공고 보기' })
  async getJobNoticeList(@Body() getJobNoticeListDto: GetJobNoticeListDto): Promise<IGetAllJobNoticeResponse> {
    return await this.jobNoticeService.getAllJobNotice(getJobNoticeListDto)
  }

  @Get('/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '개별 채용 공고 보기' })
  async getJobNotice(@Param('jobId') jobId: number): Promise<ICreateJobNoticeResponse> {
    return await this.jobNoticeService.getJobNoticeById(jobId)
  }

  @Post('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 검색' })
  async searchJobNoticeList(@Body() dto: SearchJobNoticeListDto): Promise<IGetAllJobNoticeResponse> {
    return await this.jobNoticeService.searchJobNoticeList(dto)
  }

  @Post('bookmark/:jobId/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 북마크 추가' })
  async createBookmarkedJobNotice(@Param('jobId') jobId: number, @Param('userId') userId: string): Promise<null> {
    await this.jobNoticeService.createBookmarkedJobNotice(jobId, userId)
    return null
  }

  @Delete('bookmark/:jobId/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 북마크 삭제' })
  async deleteBookmarkedJobNotice(@Param('jobId') jobId: number, @Param('userId') userId: string): Promise<null> {
    await this.jobNoticeService.deleteBookmarkedJobNotice(jobId, userId)
    return null
  }

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

  @Delete('/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 삭제' })
  async DeleteJobNotice(@Param('jobId') jobId: number): Promise<JobNotice> {
    return await this.jobNoticeService.deleteJobNotice(jobId)
  }
}
