import { FilteredJobNoticeDto } from '../filtered.job-notice.dto'

export class GetAllJobNoticeResponseDto {
  numTotal: number
  resultList: FilteredJobNoticeDto[]
}
