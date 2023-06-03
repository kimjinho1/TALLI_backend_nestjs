import { Company } from '@prisma/client'

export * from './CreateCompany.dto'
export * from './UpdateCompany.dto'

export interface IGetCompanyListResponse {
  numTotal: number
  resultList: Company[]
}
