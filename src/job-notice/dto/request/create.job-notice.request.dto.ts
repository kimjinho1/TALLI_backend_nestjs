import { Transform, Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsString, Min, ValidateIf } from 'class-validator'

export class CreateJobNoticeRequestDto {
  @IsInt()
  @Min(0)
  companyId: number

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  titleImageUrl: string | null

  @IsString()
  @IsNotEmpty()
  category: string

  @Transform(({ value }) => (value ? new Date(value) : null))
  @ValidateIf((object, value) => value !== null)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  deadline: Date | null

  @IsString()
  @IsNotEmpty()
  experience: string

  @IsString()
  @IsNotEmpty()
  education: string

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  requirements: string | null

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  preferences: string | null

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  salary: string | null

  @IsString()
  @IsNotEmpty()
  jobType: string

  @IsString()
  @IsNotEmpty()
  jobLocation: string

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  details: string | null

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  detailsImageUrl: string | null

  @IsString()
  @IsNotEmpty()
  jobWebsite: string
}
