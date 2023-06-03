import { Type } from 'class-transformer'
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator'
import { FilterDto } from './GetJobNoticeList.dto'

const order = ['최신 등록 순', '조회 많은 순', '북마크 많은 순', '마감일 빠른 순']

export class SearchJobNoticeListDto {
  @IsInt()
  @Min(0)
  index: number

  @IsInt()
  @Min(1)
  difference: number

  @IsString()
  @IsNotEmpty()
  searchWord: string

  @IsString()
  @IsNotEmpty()
  @IsIn(order)
  order: string

  @ValidateNested()
  @IsDefined()
  @Type(() => FilterDto)
  filter: FilterDto
}
