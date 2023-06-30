import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Company } from '@prisma/client'
import { CompanyRepository } from './company.repository'
import { CreateCompanyRequestDto, UpdateCompanyRequestDto } from './dto/request'
import { GetCompanyListResponseDto } from './dto/response'

@Injectable()
export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  // 전체 회사 정보 보기
  async getCompanyList(index: number, difference: number): Promise<GetCompanyListResponseDto> {
    // 범위 입력이 올바른지 확인 -> 에러일 시 400 에러 코드 반환
    if (index < 0 || difference < 1) {
      throw new BadRequestException('잘못된 범위 입력입니다')
    }

    // response 생성
    const numTotal = await this.repository.getCompanyCount()
    const selectedCompany: Company[] = await this.repository.getCompanyList(index, difference)
    const response: GetCompanyListResponseDto = {
      numTotal,
      resultList: selectedCompany
    }

    return response
  }

  // 개별 회사 정보 보기
  async getCompanyById(companyId: number): Promise<Company> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedCompany: Company | null = await this.repository.getCompanyById(companyId)
    if (!existedCompany) {
      throw new NotFoundException('존재하지 않는 회사입니다')
    }

    return existedCompany
  }

  // 회사 정보 추가
  async createCompany(dto: CreateCompanyRequestDto): Promise<Company> {
    // 회사 이름 중복 처리 -> 에러일 시 400 에러 코드 반환
    const existedCompany: Company | null = await this.repository.getCompanyByCompanyName(dto.companyName)
    if (existedCompany) {
      throw new BadRequestException('이미 존재하는 회사 이름입니다')
    }

    // Company 생성
    const createdCompany: Company = await this.repository.createCompany(dto)

    return createdCompany
  }

  // 회사 정보 수정
  async updateCompany(companyId: number, dto: UpdateCompanyRequestDto): Promise<Company> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedCompany: Company | null = await this.repository.getCompanyById(companyId)
    if (!existedCompany) {
      throw new NotFoundException('존재하지 않는 회사입니다')
    }

    // 회사 이름 중복 처리 -> 에러일 시 400 에러 코드 반환
    if (dto.companyName !== null && dto.companyName !== undefined) {
      const duplicatedNameCompany: Company | null = await this.repository.getCompanyByCompanyName(dto.companyName)
      if (duplicatedNameCompany) {
        throw new BadRequestException('이미 존재하는 회사 이름입니다')
      }
    }

    // Company 업데이트
    const updatedCompany: Company = await this.repository.updateCompany(companyId, dto)

    return updatedCompany
  }

  // 회사 정보 수정
  async deleteCompany(companyId: number): Promise<Company> {
    // 존재하는 회사인지 확인 -> 에러일 시 404 에러 코드 반환
    const existedCompany: Company | null = await this.repository.getCompanyById(companyId)
    if (!existedCompany) {
      throw new NotFoundException('존재하지 않는 회사입니다')
    }

    // Company 삭제
    const deletedCompany: Company = await this.repository.deleteCompany(companyId)

    return deletedCompany
  }
}
