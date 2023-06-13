import { Type } from 'class-transformer'
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator'
import { FilterDto } from '../filter.dto'

const category = ['전체', '보건관리자', '임상연구', '보험심사']
const order = ['최신 등록 순', '조회 많은 순', '북마크 많은 순', '마감일 빠른 순']

export class GetJobNoticeListRequestDto {
  @IsInt()
  @Min(0)
  index: number

  @IsInt()
  @Min(1)
  difference: number

  @IsString()
  @IsNotEmpty()
  @IsIn(category)
  category: string

  @IsString()
  @IsNotEmpty()
  @IsIn(order)
  order: string

  @ValidateNested()
  @IsDefined()
  @Type(() => FilterDto)
  filter: FilterDto
}
