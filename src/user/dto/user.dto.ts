import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsString, IsUrl, ValidateIf } from 'class-validator'

const sex = ['male', 'female']

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  name: string | null

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsIn(sex)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  sex: string | null

  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  age: string | null

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsUrl()
  @ValidateIf((object, value) => value !== null)
  imageUrl: string | null

  @IsString()
  currentJob: string
}
