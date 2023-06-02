import { Company, JobNotice } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

/*
 ** request 타입들
 */
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

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  deadline: Date

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

/*
 ** response 타입들
 */
export interface ICreateJobNoticeResponse {
  jobNotice: JobNotice
  companyInfo: Company
}
