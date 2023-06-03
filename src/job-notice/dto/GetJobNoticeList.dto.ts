import { Type } from 'class-transformer'
import { IsArray, IsDefined, IsIn, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator'

const category = ['전체', '보건관리자', '임상연구', '보험심사']
const order = ['최신 등록 순', '조회 많은 순', '북마크 많은 순', '마감일 빠른 순']

export class FilterDto {
  @IsArray()
  @IsString({ each: true })
  location: string[]

  @IsArray()
  @IsString({ each: true })
  experience: string[]

  @IsArray()
  @IsString({ each: true })
  education: string[]

  @IsArray()
  @IsString({ each: true })
  certificate: string[]

  @IsArray()
  @IsString({ each: true })
  companyType: string[]

  @IsArray()
  @IsString({ each: true })
  jobType: string[]
}

export class GetJobNoticeListDto {
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
