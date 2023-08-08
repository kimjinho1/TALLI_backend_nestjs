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
import { CompanyService } from 'src/core/application/service/company.service'
import { CompanyListDto } from 'src/core/application/service/dto/company/response'

@ApiTags('회사 API')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: '전체 회사 정보 보기', description: '모든 회사의 정보를 반환합니다.' })
  @ApiQuery({ name: 'index', required: true, description: '시작 위치', type: Number })
  @ApiQuery({ name: 'difference', required: true, description: '개수', type: Number })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: CompanyListDto
  })
  @ApiBadRequestResponse({
    description: '쿼리(index, difference)가 올바르지 않은 경우, 400 Bad Request 응답합니다.'
  })
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async getCompanyList(
    @Query('index') index: number,
    @Query('difference') difference: number
  ): Promise<CompanyListDto> {
    return await this.companyService.getCompanyList(index, difference)
  }
}
