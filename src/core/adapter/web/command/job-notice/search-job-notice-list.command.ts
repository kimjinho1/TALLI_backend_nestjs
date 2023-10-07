import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator'
import { FilterDto } from './get-job-notice-list.command'

const order = ['최신 등록 순', '조회 많은 순', '북마크 많은 순', '마감일 빠른 순']

export class SearchJobNoticeListCommand {
  @ApiProperty({ description: '시작 인덱스', example: 0 })
  @IsInt()
  @Min(0)
  index: number

  @ApiProperty({ description: '페이지 당 공고 수', example: 5 })
  @IsInt()
  @Min(1)
  difference: number

  @ApiProperty({ description: '검색어', example: '채용공고' })
  @IsString()
  @IsNotEmpty()
  searchWord: string

  @ApiProperty({ description: '정렬', example: '마감일 빠른 순' })
  @IsString()
  @IsNotEmpty()
  @IsIn(order)
  order: string

  @ApiProperty({ type: [FilterDto], description: '필터 정보들' })
  @ValidateNested()
  @IsDefined()
  @Type(() => FilterDto)
  filter: FilterDto
}
