import { Prisma } from '@prisma/client'

export type PartnerInfosDto = Prisma.ReviewGetPayload<{
  select: {
    review: true
    user: {
      select: {
        nickname: true
        currentJob: true
      }
    }
  }
}>[]
