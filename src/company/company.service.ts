import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { CreateCompanyDto } from './dto/CreateCompany.dto'
import { CompanyRepository } from './repository/company.repository'

@Injectable()
export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  // 회사 정보 추가
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // 회사 이름 중복 처리 -> 에러일 시 409 에러 코드 반환
    const existedCompany: Company | null = await this.repository.getCompanyByCompanyName(createCompanyDto.companyName)
    if (existedCompany) {
      throw new HttpException('이미 존재하는 회사 이름입니다.', HttpStatus.CONFLICT)
    }

    // Company 생성
    const createdCompany: Company = await this.repository.createCompany(createCompanyDto)

    // post 결과 반환
    return createdCompany
  }
}
