import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsString, IsUUID, Min, ValidateIf } from 'class-validator'

export class CreateJobNoticeCommand {
  @ApiProperty({ description: '회사 ID', example: '1' })
  @IsInt()
  @Min(0)
  companyId: number

  @ApiProperty({ description: 'BigQuery ID', example: 'UUID' })
  @IsUUID()
  bigQueryId: string

  @ApiProperty({ description: '공고명', example: '탈리 신입 개발자 채용' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: '공고 이미지 URL', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  titleImageUrl: string | null

  @ApiProperty({ description: '직종', example: '임상연구' })
  @IsString()
  @IsNotEmpty()
  category: string

  @ApiProperty({ description: '마감일', example: '2024-03-01 10:10:10', oneOf: [{ type: 'date' }, { type: 'null' }] })
  @Transform(({ value }) => (value ? new Date(value) : null))
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  deadline: Date | null

  @ApiProperty({ description: '경력', example: '경력' })
  @IsString()
  @IsNotEmpty()
  experience: string

  @ApiProperty({ description: '학력', example: '초대졸 이상 (2, 3년제)' })
  @IsString()
  @IsNotEmpty()
  education: string

  @ApiProperty({ description: '필수자격', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  requirements: string | null

  @ApiProperty({ description: '우대조건', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  preferences: string | null

  @ApiProperty({ description: '급여', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  salary: string | null

  @ApiProperty({ description: '고용형태', example: '프리랜서' })
  @IsString()
  @IsNotEmpty()
  jobType: string

  @ApiProperty({ description: '근무지역', example: '서울' })
  @IsString()
  @IsNotEmpty()
  jobLocation: string

  @ApiProperty({ description: '상세 모집 정보', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  details: string | null

  @ApiProperty({ description: '상세 이미지 URL', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  detailsImageUrl: string | null

  @ApiProperty({ description: '채용 공고 홈페이지', example: 'jobwebsite' })
  @IsString()
  @IsNotEmpty()
  jobWebsite: string
}
