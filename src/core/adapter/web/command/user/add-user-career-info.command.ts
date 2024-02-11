import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { UserCareerInfoResponseDto } from 'src/core/application/service/dto/user/response'

export class AddUserCareerInfoDto {
  @ApiProperty({ description: '유저의 경력 정보' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserCareerInfoResponseDto)
  data: UserCareerInfoResponseDto[]
}
