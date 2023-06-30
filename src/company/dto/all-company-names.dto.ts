import { Prisma } from '@prisma/client'

export type AllCompanyNamesDto = Prisma.CompanyGetPayload<{
  select: {
    companyName: true
  }
}>
