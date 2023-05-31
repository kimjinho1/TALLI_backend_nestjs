import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Company } from '@prisma/client'
import { CompanyService } from './company.service'
import { CreateCompanyDto } from './dto/CreateCompany.dto'

@Controller('company')
@ApiTags('회사 API')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '회사 정보 추가' })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.companyService.createCompany(createCompanyDto)
  }
}
