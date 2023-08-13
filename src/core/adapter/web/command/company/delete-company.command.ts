import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class DeleteCompanyCommand {
  @ApiProperty({ description: '회사 ID', example: 1 })
  @IsNumber()
  companyId: number
}
