import { Company } from '@prisma/client'

export interface IGetCompanyListResponse {
  numTotal: number
  resultList: Company[]
}
