import { ApiProperty } from '@nestjs/swagger'
import { Company } from '@prisma/client'

export class GetCompanyListResponseDto {
  @ApiProperty({ description: '전체 회사 개수', example: 180 })
  numTotal: number

  @ApiProperty({ description: 'Company[]' })
  resultList: Company[]
}
