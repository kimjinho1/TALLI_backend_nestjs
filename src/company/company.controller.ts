import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Company } from '@prisma/client'
import { CompanyService } from './company.service'
import { CreateCompanyRequestDto, UpdateCompanyRequestDto } from './dto/request'
import { GetCompanyListResponseDto } from './dto/response'

@Controller('company')
@ApiTags('회사 API')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '전체 회사 정보 보기' })
  async getCompanyList(
    @Query('index') index: number,
    @Query('difference') difference: number
  ): Promise<GetCompanyListResponseDto> {
    return await this.companyService.getCompanyList(index, difference)
  }

  @Get('/:companyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '개별 회사 정보 보기' })
  async getCompanyById(@Param('companyId') companyId: number): Promise<Company> {
    return await this.companyService.getCompanyById(companyId)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '회사 정보 추가' })
  async createCompany(@Body() createCompanyDto: CreateCompanyRequestDto): Promise<Company> {
    return await this.companyService.createCompany(createCompanyDto)
  }

  @Patch('/:companyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '회사 정보 수정' })
  async updateCompany(
    @Param('companyId') companyId: number,
    @Body() updateCompanyDto: UpdateCompanyRequestDto
  ): Promise<Company> {
    return await this.companyService.updateCompany(companyId, updateCompanyDto)
  }

  @Delete('/:companyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '회사 정보 삭제' })
  async deleteCompany(@Param('companyId') companyId: number): Promise<Company> {
    return await this.companyService.deleteCompany(companyId)
  }
}
