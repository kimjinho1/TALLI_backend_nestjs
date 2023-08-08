import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CompanyRepository } from 'src/core/adapter/repository/company.repository'
import { CompanyListDto } from './dto/company/response'
import { ErrorMessages } from 'src/common/exception/error.messages'

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
}
