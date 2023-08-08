import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class CompanyRepository {
  constructor(private prisma: PrismaService) {}

  /** 전체 회사 개수 반환 */
  async getTotalCompanyCount(): Promise<number> {
    return await this.prisma.company.count()
  }

  /** 모든 회사 정보 반환 */
  async getCompanyList(index: number, difference: number): Promise<Company[]> {
    return await this.prisma.company.findMany({
      skip: index,
      take: difference
    })
  }

  /** 회사 정보 반환 */
  async getCompany(companyId: number): Promise<Company | null> {
    return await this.prisma.company.findFirst({
      where: {
        companyId
      }
    })
  }
}
