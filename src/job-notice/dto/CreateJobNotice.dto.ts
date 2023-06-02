import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export class CreateJobNoticeDto {
  @IsInt()
  @Min(0)
  companyId: number

  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titleImageUrl: string | null

  @IsString()
  @IsNotEmpty()
  category: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deadline: string | null

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  experience: string | null

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  education: string | null

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  requirements: string | null

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  preferences: string | null

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  salary: string | null

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  jobType: string | null

  @IsString()
  @IsNotEmpty()
  jobLocation: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  details: string | null

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  detailsImageUrl: string | null

  @IsString()
  @IsNotEmpty()
  jobWebsite: string
}
