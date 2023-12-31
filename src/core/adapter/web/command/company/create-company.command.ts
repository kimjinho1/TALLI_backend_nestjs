import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsPositive, IsString, ValidateIf } from 'class-validator'

export class CreateCompanyCommand {
  @ApiProperty({ description: '회사명', example: '탈리' })
  @IsString()
  @IsNotEmpty()
  companyName: string

  @ApiProperty({ description: '로고 URL', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  logoUrl: string | null

  @ApiProperty({ description: '기업 형태', example: '대기업' })
  @IsString()
  @IsNotEmpty()
  companyType: string

  @ApiProperty({ description: '사원 수', example: 1000, oneOf: [{ type: 'number' }, { type: 'null' }] })
  @IsInt()
  @IsPositive()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  employee: number | null

  @ApiProperty({ description: '설립일', example: '2021-04-18 00:00:00', oneOf: [{ type: 'date' }, { type: 'null' }] })
  @IsDate()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform(({ value }) => (value ? new Date(value) : null))
  @Type(() => Date)
  incorporation: Date | null

  @ApiProperty({ description: '회사 주소', example: '서울 강남' })
  @IsString()
  @IsNotEmpty()
  companyLocation: string

  @ApiProperty({
    description: '회사 홈페이지',
    example: 'https://salvador-talli.web.app/main',
    oneOf: [{ type: 'string' }, { type: 'null' }]
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  companyWebsite: string | null
}
