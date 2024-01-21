import { Prisma } from '@prisma/client'

export type UserQuestionInfosDto = Prisma.QuestionGetPayload<{
  select: {
    question: true
    createdAt: true
    partner: {
      select: {
        imageUrl: true
        nickname: true
        job: true
      }
    }
    answer: {
      select: {
        answer: true
        createdAt: true
      }
    }
  }
}>[]
