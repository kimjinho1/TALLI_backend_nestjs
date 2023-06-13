import { IsArray, IsString } from 'class-validator'

export class FilterDto {
  @IsArray()
  @IsString({ each: true })
  location: string[]

  @IsArray()
  @IsString({ each: true })
  experience: string[]

  @IsArray()
  @IsString({ each: true })
  education: string[]

  @IsArray()
  @IsString({ each: true })
  certificate: string[]

  @IsArray()
  @IsString({ each: true })
  companyType: string[]

  @IsArray()
  @IsString({ each: true })
  jobType: string[]
}
