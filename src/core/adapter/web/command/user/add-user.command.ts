import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import { jobList } from 'src/core/application/service/dto/user/response'

const SEX = ['male', 'female']
const ROLES = ['USER']
const PROVIDERS = ['none', 'kakao']

export class UserDto {
  @ApiProperty({ description: '이름', example: '김진호', oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  name: string | null

  @ApiProperty({ description: '닉네임', example: 'jinhokim' })
  @IsString()
  @IsNotEmpty()
  nickname: string

  @ApiProperty({ description: '성별', example: 'male', oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsIn(SEX)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  sex: string | null

  @ApiProperty({ description: '생년월일', example: '26', oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  age: string | null

  @ApiProperty({ description: '이메일', example: 'rlawlsgh8113@naver.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: '프로필 사진', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @ValidateIf((object, value) => value !== null && value !== undefined)
  imageUrl: string | null

  @ApiProperty({ description: '현재 직업', example: '임상 간호사' })
  @IsString()
  currentJob: string

  @ApiProperty({ description: '유저 레벨', example: 'USER', oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsIn(ROLES)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  role: string

  @ApiProperty({ description: '소셜 로그인 타입', example: 'kakao' })
  @IsString()
  @IsIn(PROVIDERS)
  provider: string
}

export class CurrentJobDetailDto {
  @ApiProperty({ description: '학년', example: '4' })
  @IsString()
  grade: string

  @ApiProperty({ description: '임상 경력', example: 'example' })
  @IsString()
  activePeriod: string

  @ApiProperty({ description: '탈임상 직업', example: 'example' })
  @IsString()
  escapedJob: string

  @ApiProperty({ description: '탈임상 경력', example: 'example' })
  @IsString()
  escapedPeriod: string

  @ApiProperty({ description: '휴직 기간', example: 'example' })
  @IsString()
  inactivePeriod: string

  @ApiProperty({ description: '기타 직업', example: 'example' })
  @IsString()
  otherJob: string
}

export class AddUserInfoCommand extends UserDto {
  @ApiProperty({ description: '유저 자세한 정보' })
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => CurrentJobDetailDto)
  currentJobDetail: CurrentJobDetailDto

  @ApiProperty({ description: '최대 10개인 문자열 배열', example: ['보건관리자', '임상연구'] })
  @IsDefined()
  @IsIn(jobList, { each: true })
  jobOfInterestList: string[]
}
