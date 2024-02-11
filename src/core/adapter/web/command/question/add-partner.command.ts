import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator'

const category = [
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
export class AddPartnerCommandDto {
  @ApiProperty({ description: '현직자 닉네임', example: 'jinhokim' })
  @IsString()
  @IsNotEmpty()
  nickname: string

  @ApiProperty({
    description: '현직자 프로필 사진',
    example: 'http://talli.com/1.png',
    oneOf: [{ type: 'string' }, { type: 'null' }]
  })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  imageUrl: string | null

  @ApiProperty({ description: '직종', example: '임상연구' })
  @IsString()
  @IsNotEmpty()
  @IsIn(category)
  category: string

  @ApiProperty({ description: '현직자 직업', example: '국내 CRO' })
  @IsString()
  @IsNotEmpty()
  job: string

  @ApiProperty({ description: '탈임상 경력', example: '6' })
  @IsInt()
  escapedPeriod: number

  @ApiProperty({ description: '임상 경력', example: '3' })
  @IsInt()
  activePeriod: number

  @ApiProperty({ description: '보유 면허', example: '간호 면허 보유' })
  @IsString()
  @IsNotEmpty()
  license: string

  @ApiProperty({ description: '축약형 소개 제목', example: '축약형 자기 소개~' })
  @IsString()
  @IsNotEmpty()
  introductionShort: string

  @ApiProperty({ description: '기본형 소개 제목', example: '안녕하세요. 탈임상 6년차 스텔라입니다~' })
  @IsString()
  @IsNotEmpty()
  introductionTitle: string

  @ApiProperty({ description: '기본형 소개 내용', example: '임상 경험 없이 CRO로 취직한 노하우를 나눠드리고 싶어요.' })
  @IsString()
  @IsNotEmpty()
  introductionContent: string

  @ApiProperty({ type: [String], description: '추천 문구 모음', example: ['A에게 추천', 'B에게 추천'] })
  @IsArray()
  @IsString({ each: true })
  recommendation: string[]
}
