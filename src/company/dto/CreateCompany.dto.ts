import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string

  @IsString()
  @IsNotEmpty()
  logoUrl: string

  @IsString()
  @IsNotEmpty()
  companyType: string

  @IsNumber()
  @IsPositive()
  employee: number

  @IsString()
  @IsNotEmpty()
  incorporation: string

  @IsString()
  @IsNotEmpty()
  companyLocation: string

  @IsString()
  @IsNotEmpty()
  companyWebsite: string
}
