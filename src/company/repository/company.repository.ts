import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateCompanyDto } from '../dto/CreateCompany.dto'

@Injectable()
export class CompanyRepository {
  constructor(private prisma: PrismaService) {}

  // companyName으로 Company 찾기
  async getCompanyByCompanyName(companyName: string): Promise<Company | null> {
    return await this.prisma.company.findFirst({
      where: {
        companyName
      }
    })
  }

  // 회사 정보 추가
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.prisma.company.create({
      data: {
        ...createCompanyDto
      }
    })
  }
}
