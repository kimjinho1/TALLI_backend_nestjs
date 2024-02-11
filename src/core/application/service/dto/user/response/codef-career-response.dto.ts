import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CodefCareerResponseDto {
  @ApiProperty({ description: '상호(사업장명)', example: '(주)탈리' })
  @IsString()
  @IsNotEmpty()
  companyName: string

  @ApiProperty({ description: '자격취득일', example: '20110101' })
  @IsString()
  @IsNotEmpty()
  startDate: string

  @ApiProperty({ description: '자격상실일', example: '20210101' })
  @IsString()
  @IsNotEmpty()
  endDate: string
}
