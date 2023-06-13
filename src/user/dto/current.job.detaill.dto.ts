import { IsString } from 'class-validator'

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
