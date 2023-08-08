import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'
import { CreateCompanyCommand } from 'src/core/adapter/web/command/company'

export class CompanyDto extends CreateCompanyCommand {
  @ApiProperty({ description: '회사 ID', example: '1' })
  @IsNumber()
  @IsPositive()
  companyId: number
}

export class CompanyListDto {
  @ApiProperty({ description: '전체 회사 개수', example: 180 })
  numTotal: number

  @ApiProperty({ description: '회사 정보들', type: [CompanyDto] })
  resultList: CompanyDto[]
}
