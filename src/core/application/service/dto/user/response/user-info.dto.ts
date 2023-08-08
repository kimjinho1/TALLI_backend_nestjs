import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsString, IsUrl, ValidateIf } from 'class-validator'
import { CurrentJobDetail } from '@prisma/client'

const sex = ['male', 'female']

export class UserDto {
  @ApiProperty({ description: '이름', example: '김진호', oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  name: string | null

  @ApiProperty({ description: '닉네임', example: 'jinhokim' })
  @IsString()
  @IsNotEmpty()
  nickname: string

  @ApiProperty({ description: '성별', example: 'male', oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsIn(sex)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  sex: string | null

  @ApiProperty({ description: '생년월일', example: '26', oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  age: string | null

  @ApiProperty({ description: '이메일', example: 'rlawlsgh8113@naver.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: '프로필 사진', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsUrl()
  @ValidateIf((object, value) => value !== null)
  imageUrl: string | null

  @ApiProperty({ description: '현재 직업', example: '임상 간호사' })
  @IsString()
  currentJob: string
}

export class UserInfoDto extends UserDto {
  @ApiProperty({ description: 'CurrentJobDetail' })
  currentJobDetail: CurrentJobDetail

  @ApiProperty({ description: 'JobOfInterest[]' })
  jobOfInterest: String[]
}
