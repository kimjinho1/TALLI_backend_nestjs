import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class DeleteCompanyRequestDto {
  @ApiProperty({ description: '회사 ID', example: 0 })
  @IsNumber()
  companyId: number
}
