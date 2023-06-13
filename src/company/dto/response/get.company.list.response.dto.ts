import { Company } from '@prisma/client'

export class GetCompanyListResponseDto {
  numTotal: number
  resultList: Company[]
}
