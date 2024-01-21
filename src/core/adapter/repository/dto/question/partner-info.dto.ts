import { Prisma } from '@prisma/client'

export type PartnerInfoDto = Prisma.ReviewGetPayload<{
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
