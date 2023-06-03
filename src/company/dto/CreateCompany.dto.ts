import { Transform, Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsPositive, IsString, ValidateIf } from 'class-validator'

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  logoUrl!: string | null

  @IsString()
  @IsNotEmpty()
  companyType: string

  @IsInt()
  @IsPositive()
  @ValidateIf((object, value) => value !== null)
  employee: number | null

  @IsDate()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Transform(({ value }) => (value ? new Date(value) : null))
  @Type(() => Date)
  incorporation: Date | null

  @IsString()
  @IsNotEmpty()
  companyLocation: string

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  companyWebsite: string | null
}
