import { Company } from '@prisma/client'

export interface GetCompanyListResponseDto {
  numTotal: number
  resultList: Company[]
}
