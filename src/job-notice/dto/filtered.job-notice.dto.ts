export class FilteredJobNoticeDto {
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
