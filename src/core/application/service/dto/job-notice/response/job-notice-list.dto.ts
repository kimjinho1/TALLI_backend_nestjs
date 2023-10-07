export class FilteredJobNotice {
  jobId: number
  title: string
  titleImageUrl: string | null
  companyName: string
  logoUrl: string | null
  jobLocation: string
  experience: string
  deadline: Date
  hits: number
  bookmarks: number
}

export class JobNoticeListDto {
  numTotal: number
  resultList: FilteredJobNotice[]
}
