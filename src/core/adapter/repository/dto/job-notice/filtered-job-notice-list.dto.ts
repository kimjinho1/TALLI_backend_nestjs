import { Prisma } from '@prisma/client'

export type FilteredJobNoticeListDto = Prisma.JobNoticeGetPayload<{
  select: {
    jobNoticeId: true
    title: true
    titleImageUrl: true
    jobLocation: true
    experience: true
    deadline: true
    hits: true
    bookmarks: true
    company: {
      select: {
        companyName: true
        logoUrl: true
      }
    }
  }
}>[]
