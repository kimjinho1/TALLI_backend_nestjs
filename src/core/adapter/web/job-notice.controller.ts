import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import {
  FilteredJobNotice,
  JobNoticeDto,
  JobNoticeInfoDto,
  JobNoticeListDto
} from 'src/core/application/service/dto/job-notice/response'
import { JobNoticeService } from 'src/core/application/service/job-notice.service'
import {
  CreateJobNoticeCommand,
  DeleteJobNoticeCommand,
  GetJobNoticeListCommand,
  SearchJobNoticeListCommand,
  UpdateJobNoticeCommand,
  createBookmarkedJobNoticeCommand
} from './command/job-notice'
import { RolesGuard } from 'src/auth/role/role.guard'
import { Roles } from 'src/auth/role/roles.decorator'

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

  @ApiOperation({ summary: '개별 채용 공고 보기' })
  @ApiParam({
    name: 'jobId',
    required: true,
    description: '채용 공고 ID',
    type: Number
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: JobNoticeInfoDto
  })
  @ApiNotFoundResponse({
    description: 'jobId에 매칭되는 채용 공고가 없는 경우, 404 Not Found 응답합니다.'
  })
  @Get('/:jobId')
  async getJobNotice(@Param('jobId') jobId: number): Promise<JobNoticeInfoDto> {
    return await this.jobNoticeService.getJobNoticeInfo(jobId)
  }

  @ApiOperation({ summary: '채용 공고 북마크 추가' })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.',
    type: createBookmarkedJobNoticeCommand
  })
  @ApiBadRequestResponse({
    description: '이미 북마크된 채용 공고인 경우, 400 Bad Request 를 응답합니다.'
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('bookmark/:jobId')
  @UseGuards(JwtAuthGuard)
  async createBookmarkedJobNotice(
    @Req() req: Request,
    @Param('jobId') jobId: number
  ): Promise<createBookmarkedJobNoticeCommand> {
    return await this.jobNoticeService.createBookmarkedJobNotice(jobId, req.user.userId)
  }

  @ApiOperation({ summary: '채용 공고 북마크 삭제' })
  @ApiBody({ type: createBookmarkedJobNoticeCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: createBookmarkedJobNoticeCommand
  })
  @Delete('bookmark/:jobId')
  @UseGuards(JwtAuthGuard)
  async deleteBookmarkedJobNotice(
    @Req() req: Request,
    @Param('jobId') jobId: number
  ): Promise<createBookmarkedJobNoticeCommand> {
    return await this.jobNoticeService.deleteBookmarkedJobNotice(jobId, req.user.userId)
  }

  @ApiOperation({ summary: '북마크한 채용 공고 보기' })
  @ApiParam({
    name: 'order',
    required: true,
    description: '정렬 기준',
    type: String
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: [FilteredJobNotice]
  })
  @Get('bookmark/list')
  @UseGuards(JwtAuthGuard)
  async getBookmarkedJobNotice(@Req() req: Request, @Query('order') order: string): Promise<FilteredJobNotice[]> {
    return await this.jobNoticeService.getAllBookmarkedJobNotice(req.user.userId, order)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createJobNotice(@Body() dto: CreateJobNoticeCommand): Promise<JobNoticeInfoDto> {
    return await this.jobNoticeService.createJobNotice(dto)
  }

  @ApiOperation({ summary: '채용 공고 수정' })
  @ApiParam({
    name: 'jobId',
    required: true,
    description: '채용 공고 ID',
    type: Number
  })
  @ApiBody({ type: UpdateJobNoticeCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: JobNoticeInfoDto
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('/:jobId')
  async UpdateJobNotice(@Param('jobId') jobId: number, @Body() dto: UpdateJobNoticeCommand): Promise<JobNoticeInfoDto> {
    return await this.jobNoticeService.updateJobNotice(jobId, dto)
  }

  @ApiOperation({ summary: '채용 공고 삭제' })
  @ApiBody({ type: DeleteJobNoticeCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: JobNoticeDto
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('/:jobId')
  async DeleteJobNotice(@Param('jobId') jobId: number): Promise<JobNoticeDto> {
    return await this.jobNoticeService.deleteJobNotice(jobId)
  }

  @ApiOperation({ summary: '채용 공고 검색' })
  @ApiBody({ type: SearchJobNoticeListCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: JobNoticeListDto
  })
  @Post('/search')
  async searchJobNoticeList(@Body() dto: SearchJobNoticeListCommand): Promise<JobNoticeListDto> {
    return await this.jobNoticeService.searchJobNoticeList(dto)
  }

  @ApiOperation({
    summary: '검색 자동 완성 목록 보기',
    description: '검색 자동 완성 목록(전체 공고명&회사명 목록) 보기'
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: [String]
  })
  @Get('/search/autocomplete')
  async getAutoComplete(): Promise<string[]> {
    return await this.jobNoticeService.getAutoComplete()
  }
}
