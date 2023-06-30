import { Prisma } from '@prisma/client'

export type AllJobCompanyTitlesDto = Prisma.JobNoticeGetPayload<{
  select: {
    title: true
  }
}>
