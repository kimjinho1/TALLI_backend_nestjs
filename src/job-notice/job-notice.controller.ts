import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BookmarkedJobNotice, JobNotice } from '@prisma/client'
import {
  CreateJobNoticeRequestDto,
  DeleteJobNoticeRequestDto,
  GetJobNoticeListRequestDto,
  JobUserIdRequestDto,
  SearchJobNoticeListRequestDto,
  UpdateJobNoticeRequestDto
} from './dto/request'
import { CreateJobNoticeResponseDto, GetAllJobNoticeResponseDto } from './dto/response'
import { JobNoticeService } from './job-notice.service'

@Controller('job-notice')
@ApiTags('채용 공고 API')
export class JobNoticeController {
  constructor(private readonly jobNoticeService: JobNoticeService) {}

  @Post('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '전체 채용 공고 보기' })
  async getJobNoticeList(@Body() dto: GetJobNoticeListRequestDto): Promise<GetAllJobNoticeResponseDto> {
    return await this.jobNoticeService.getAllJobNotice(dto)
  }

  @Get('/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '개별 채용 공고 보기' })
  async getJobNotice(@Param('jobId') jobId: number): Promise<CreateJobNoticeResponseDto> {
    return await this.jobNoticeService.getJobNoticeById(jobId)
  }

  @Post('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 검색' })
  async searchJobNoticeList(@Body() dto: SearchJobNoticeListRequestDto): Promise<GetAllJobNoticeResponseDto> {
    return await this.jobNoticeService.searchJobNoticeList(dto)
  }

  @Post('bookmark')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 북마크 추가' })
  async createBookmarkedJobNotice(@Body() dto: JobUserIdRequestDto): Promise<BookmarkedJobNotice> {
    return await this.jobNoticeService.createBookmarkedJobNotice(dto.jobId, dto.userId)
  }

  @Delete('bookmark')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 북마크 삭제' })
  async deleteBookmarkedJobNotice(@Body() dto: JobUserIdRequestDto): Promise<null> {
    await this.jobNoticeService.deleteBookmarkedJobNotice(dto.jobId, dto.userId)
    return null
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 추가' })
  async createJobNotice(@Body() dto: CreateJobNoticeRequestDto): Promise<CreateJobNoticeResponseDto> {
    return await this.jobNoticeService.createJobNotice(dto)
  }

  @Patch('/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 수정' })
  async UpdateJobNotice(
    @Param('jobId') jobId: number,
    @Body() dto: UpdateJobNoticeRequestDto
  ): Promise<CreateJobNoticeResponseDto> {
    return await this.jobNoticeService.updateJobNotice(jobId, dto)
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '채용 공고 삭제' })
  async DeleteJobNotice(@Body() dto: DeleteJobNoticeRequestDto): Promise<JobNotice> {
    return await this.jobNoticeService.deleteJobNotice(dto.jobId)
  }

  @Get('/search/autocomplte')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '검색 자동 완성 목록 보기',
    description: '검색 자동 완성 목록(전체 공고명&회사명 목록) 보기'
  })
  async getAutoComplete(): Promise<string[]> {
    return await this.jobNoticeService.getAutoComplete()
  }
}
