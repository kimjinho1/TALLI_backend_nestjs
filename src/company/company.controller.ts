import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import { Company } from '@prisma/client'
import { CompanyService } from './company.service'
import { CreateCompanyRequestDto, DeleteCompanyRequestDto, UpdateCompanyRequestDto } from './dto/request'
import { GetCompanyListResponseDto } from './dto/response'

@ApiTags('회사 API')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: '전체 회사 정보 보기', description: '모든 회사의 정보를 반환합니다.' })
  @ApiQuery({ name: 'index', required: true, description: '시작 위치', type: Number })
  @ApiQuery({ name: 'difference', required: true, description: '개수', type: Number })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: GetCompanyListResponseDto
  })
  @ApiBadRequestResponse({
    description: '쿼리(index, difference)가 올바르지 않은 경우, 400 Bad Request 응답합니다.'
  })
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getCompanyList(
    @Query('index') index: number,
    @Query('difference') difference: number
  ): Promise<GetCompanyListResponseDto> {
    return await this.companyService.getCompanyList(index, difference)
  }

  @ApiOperation({ summary: '개별 회사 정보 보기', description: 'companyId에 매칭되는 회사의 정보를 반환합니다.' })
  @ApiParam({ name: 'companyId', required: true, description: '회사 ID', type: Number })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: 'companyId에 매칭되는 회사가 없는 경우, 404 Not Found 응답합니다.'
  })
  @Get('/:companyId')
  @HttpCode(HttpStatus.OK)
  async getCompanyById(@Param('companyId') companyId: number): Promise<Company> {
    return await this.companyService.getCompanyById(companyId)
  }

  @ApiOperation({ summary: '회사 정보 추가', description: '회사 정보를 추가합니다.' })
  @ApiBody({ type: CreateCompanyRequestDto })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
  })
  @ApiConflictResponse({
    description: '회사 이름이 중복인 경우, 409 Conflict 응답합니다.'
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCompany(@Body() dto: CreateCompanyRequestDto): Promise<Company> {
    return await this.companyService.createCompany(dto)
  }

  @ApiOperation({ summary: '회사 정보 수정', description: 'companyId에 매칭되는 회사의 정보를 수정합니다.' })
  @ApiParam({ name: 'companyId', required: true, description: '회사 ID', type: Number })
  @ApiBody({ type: UpdateCompanyRequestDto })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: 'companyId에 매칭되는 회사가 없는 경우, 404 Not Found 응답합니다.'
  })
  @Patch('/:companyId')
  @HttpCode(HttpStatus.OK)
  async updateCompany(@Param('companyId') companyId: number, @Body() dto: UpdateCompanyRequestDto): Promise<Company> {
    return await this.companyService.updateCompany(companyId, dto)
  }

  @ApiOperation({ summary: '회사 정보 삭제', description: 'companyId에 매칭되는 회사의 정보를 삭제합니다.' })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: 'companyId에 매칭되는 회사가 없는 경우, 404 Not Found 응답합니다.'
  })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteCompany(@Body() dto: DeleteCompanyRequestDto): Promise<Company> {
    return await this.companyService.deleteCompany(dto.companyId)
  }
}
