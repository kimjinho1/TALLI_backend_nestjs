import { Company } from '@prisma/client'

export class GetCompanyListResponse {
  numTotal: number
  resultList: Company[]
}
