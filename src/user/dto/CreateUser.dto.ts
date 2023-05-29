import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsEnum,
  IsDateString,
  IsArray,
  IsInt,
  ValidateNested,
  IsUUID
} from 'class-validator'

enum Sex {
  Male = 'male',
  Female = 'female'
}

export class UserDto {
  @IsOptional()
  @IsString()
  name?: string | null

  @IsString()
  nickname: string

  @IsOptional()
  @IsEnum(Sex)
  sex?: string | null

  @IsOptional()
  @IsDateString()
  age?: string | null

  @IsString()
  @IsEmail()
  email: string

  @IsOptional()
  @IsUrl()
  imageUrl?: string | null

  @IsString()
  currentJob: string

  @IsArray()
  jobOfInterestList: string[]

  @IsArray()
  @IsInt({ each: true })
  bookmarkedJobNotice: number[]
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

export class CreateUserDto extends UserDto {
  @IsOptional()
  @ValidateNested()
  currentJobDetail: CurrentJobDetailDto | null
}

export class CreateCurrentJobDetailDto extends CurrentJobDetailDto {
  @IsUUID()
  userId: string
}

export class CreateUserResponseDTO extends CreateUserDto {
  @IsUUID()
  userId: string
}
