import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Company } from '@prisma/client'
import { CreateCompanyDto } from './dto/CreateCompany.dto'
import { UpdateCompanyDto } from './dto/UpdateCompany.dto'
import { CompanyRepository } from './repository/company.repository'

@Injectable()
export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  // 회사 정보 추가
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // 회사 이름 중복 처리 -> 에러일 시 409 에러 코드 반환
    const existedCompany: Company | null = await this.repository.getCompanyByCompanyName(createCompanyDto.companyName)
    if (existedCompany) {
      throw new ConflictException('이미 존재하는 회사 이름입니다.')
    }

    // Company 생성
    const createdCompany: Company = await this.repository.createCompany(createCompanyDto)

    // post 결과 반환
    return createdCompany
  }

  // 회사 정보 수정
  async updateCompany(companyId: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedCompany: Company | null = await this.repository.getCompanyById(companyId)
    if (!existedCompany) {
      throw new NotFoundException('존재하지 않는 회사입니다')
    }

    // Company 생성
    const updatedCompany: Company = await this.repository.updateCompany(companyId, updateCompanyDto)

    // post 결과 반환
    return updatedCompany
  }
}
