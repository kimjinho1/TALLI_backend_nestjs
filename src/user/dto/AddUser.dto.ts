import { CurrentJobDetail, JobOfInterest, User } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsDateString,
  ValidateNested,
  IsUUID,
  IsIn,
  IsNotEmpty,
  ArrayNotEmpty
} from 'class-validator'

const sex = ['male', 'female']
const jobList = [
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

/*
 ** 기본 타입들
 */
export class UserDto {
  @IsOptional()
  @IsString()
  name: string | null

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsOptional()
  @IsIn(sex)
  sex: string | null

  @IsOptional()
  @IsDateString()
  age: string | null

  @IsString()
  @IsEmail()
  email: string

  @IsOptional()
  @IsUrl()
  imageUrl: string | null

  @IsString()
  currentJob: string
}

export class CurrentJobDetailDto {
  @IsString()
  grade: string

  @IsString()
  activePeriod: string

  @IsString()
  escapedJob: string

  @IsString()
  escapedPeriod: string

  @IsString()
  inactivePeriod: string

  @IsString()
  otherJob: string
}

/*
 ** request 타입들
 */
export class AddUserDto extends UserDto {
  @ValidateNested({ each: true })
  @Type(() => CurrentJobDetailDto)
  currentJobDetail: CurrentJobDetailDto

  @ArrayNotEmpty()
  @IsIn(jobList, { each: true })
  jobOfInterestList: string[]
}

export class CreateJobHistoryDto extends CurrentJobDetailDto {
  @IsUUID()
  userId: string
}

/*
 ** response 타입들
 */
export interface IAddUserResponse {
  user: User
  currentJobDetail: CurrentJobDetail
  jobOfInterest: JobOfInterest[]
}
