import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateCompanyDto, UpdateCompanyDto } from './dto'

@Injectable()
export class CompanyRepository {
  constructor(private prisma: PrismaService) {}

  // 모든 Company 반환
  async getCompanyList(index: number, difference: number): Promise<Company[]> {
    return await this.prisma.company.findMany({
      skip: index,
      take: difference
    })
  }

  // 모든 Company 반환
  async getAllCompany(): Promise<Company[]> {
    return await this.prisma.company.findMany()
  }

  // companyId로 Company 찾기
  async getCompanyById(companyId: number): Promise<Company | null> {
    return await this.prisma.company.findUnique({
      where: {
        companyId
      }
    })
  }

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

  // 회사 정보 수정
  async updateCompany(companyId: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    return await this.prisma.company.update({
      where: {
        companyId
      },
      data: {
        ...updateCompanyDto
      }
    })
  }

  // 회사 정보 삭제
  async deleteCompany(companyId: number): Promise<Company> {
    return await this.prisma.company.delete({
      where: {
        companyId
      }
    })
  }
}