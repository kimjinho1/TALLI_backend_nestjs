export * from './CreateJobNotice.dto'
export * from './UpdateJobNotice.dto'
export * from './GetJobNoticeList.dto'

export interface IGetFilteredJobNotices {
  jobId: number
  title: string
  titleImageUrl: string | null
  companyName: string
  logoUrl: string | null
  jobLocation: string
  experience: string
  deadline: string
  hits: number
  bookmarks: number
}

export interface IGetAllJobNoticeResponse {
  numTotal: number
  resultList: IGetFilteredJobNotices[]
}
