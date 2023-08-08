import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CompanyRepository } from 'src/core/adapter/repository/company.repository'
import { CompanyDto, CompanyListDto } from './dto/company/response'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { Company } from '@prisma/client'
import { CreateCompanyCommand, UpdateCompanyCommand } from 'src/core/adapter/web/command/company'

@Injectable()
export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  /** 전체 회사 정보 보기 */
  async getCompanyList(index: number, difference: number): Promise<CompanyListDto> {
    const totalCompanyCount = await this.repository.getTotalCompanyCount()

    /** 범위 입력이 올바른지 확인 -> 에러일 시 400 에러 코드 반환 */
    if (index < 0 || index >= totalCompanyCount || difference < 1) {
      throw new BadRequestException(ErrorMessages.INVALID_SEARCH_RANGE_INPUT)
    }

    /** response 생성 */
    const selectedCompany = await this.repository.getCompanyList(index, difference)
    const response = {
      numTotal: totalCompanyCount,
      resultList: selectedCompany
    }
    return response
  }

  /** 개별 회사 정보 보기 */
  async getCompanyInfo(companyId: number): Promise<CompanyDto> {
    /** 존재하는 회사인지 확인 -> 없다면 404 에러 코드 반환 */
    return await this.getCompany(companyId)
  }

  /** 회사 정보 추가 */
  async createCompany(dto: CreateCompanyCommand): Promise<CompanyDto> {
    /** 회사 이름 중복 확인 -> 에러일 시 400 에러 코드 반환 */
    await this.checkCompanyDuplicateByCompanyName(dto.companyName)

    return await this.repository.createCompany(dto)
  }

  /** 회사 정보 수정 */
  async updateCompany(companyId: number, dto: UpdateCompanyCommand): Promise<CompanyDto> {
    /** 존재하는 회사인지 확인 -> 없다면 404 에러 코드 반환 */
    await this.getCompany(companyId)

    /** 회사 이름 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    if (dto.companyName !== null && dto.companyName !== undefined) {
      await this.checkCompanyDuplicateByCompanyName(dto.companyName)
    }

    return await this.repository.updateCompany(companyId, dto)
  }

  /**
   * UTILS
   */

  /** 존재하는 회사인지 확인 -> 없다면 404 에러 코드 반환 */
  private async getCompany(companyId: number): Promise<Company> {
    const company = await this.repository.getCompany(companyId)
    if (company === null) {
      throw new NotFoundException(ErrorMessages.COMPANY_NOT_FOUND)
    }
    return company
  }

  /** 회사 이름 중복 확인 -> 에러일 시 400 에러 코드 반환 */
  private async checkCompanyDuplicateByCompanyName(nickname: string): Promise<void> {
    const company = await this.repository.getCompanyByCompanyName(nickname)
    if (company) {
      throw new BadRequestException(ErrorMessages.COMPANY_NAME_ALREADY_EXISTS)
    }
  }
}
