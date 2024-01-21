import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDefined, IsIn, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator'

const category = [
  '전체',
  '보건관리자',
  '임상연구',
  '보험심사',
  '기획 / 마케팅',
  '공공기관',
  '공무원',
  '메디컬라이터',
  '영업직',
  '정신건강간호사',
  '손해사정사'
]
const order = ['최신 등록 순', '조회 많은 순', '북마크 많은 순', '마감일 빠른 순']

export class FilterDto {
  @ApiProperty({ type: [String], description: '지역', example: ['서울'] })
  @IsArray()
  @IsString({ each: true })
  location: string[]

  @ApiProperty({ type: [String], description: '경력', example: ['신입'] })
  @IsArray()
  @IsString({ each: true })
  experience: string[]

  @ApiProperty({ type: [String], description: '학력', example: ['고졸 이상'] })
  @IsArray()
  @IsString({ each: true })
  education: string[]

  @ApiProperty({ type: [String], description: '자격증', example: ['컴퓨터활용능력'] })
  @IsArray()
  @IsString({ each: true })
  certificate: string[]

  @ApiProperty({ type: [String], description: '기업형태', example: ['대기업'] })
  @IsArray()
  @IsString({ each: true })
  companyType: string[]

  @ApiProperty({ type: [String], description: '고용형태', example: ['정규직'] })
  @IsArray()
  @IsString({ each: true })
  jobType: string[]
}

export class GetJobNoticeListCommand {
  @ApiProperty({ description: '시작 인덱스', example: 0 })
  @IsInt()
  @Min(0)
  index: number

  @ApiProperty({ description: '페이지 당 공고 수', example: 5 })
  @IsInt()
  @Min(1)
  difference: number

  @ApiProperty({ description: '직종', example: '보건관리자' })
  @IsString()
  @IsNotEmpty()
  @IsIn(category)
  category: string

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
