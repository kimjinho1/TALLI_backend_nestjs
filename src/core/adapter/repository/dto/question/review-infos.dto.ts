import { Prisma } from '@prisma/client'

export type ReviewInfosDto = Prisma.ReviewGetPayload<{
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
