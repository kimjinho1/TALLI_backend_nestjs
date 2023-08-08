import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateCompanyCommand, UpdateCompanyCommand } from '../web/command/company'

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

  /** companyName으로 Company 찾기 */
  async getCompanyByCompanyName(companyName: string): Promise<Company | null> {
    return await this.prisma.company.findFirst({
      where: {
        companyName
      }
    })
  }

  /** 회사 정보 추가 */
  async createCompany(dto: CreateCompanyCommand): Promise<Company> {
    return await this.prisma.company.create({
      data: {
        ...dto
      }
    })
  }

  /** 회사 정보 수정 */
  async updateCompany(companyId: number, dto: UpdateCompanyCommand): Promise<Company> {
    return await this.prisma.company.update({
      where: {
        companyId
      },
      data: {
        ...dto
      }
    })
  }

  /** 회사 정보 삭제 */
  async deleteCompany(companyId: number): Promise<Company> {
    return await this.prisma.company.delete({
      where: {
        companyId
      }
    })
  }
}
