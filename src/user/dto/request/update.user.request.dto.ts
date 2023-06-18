import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator'

export class UpdateUserRequestDto {
  @ApiProperty({ description: '닉네임', example: 'example_nickname' })
  @IsString()
  @IsNotEmpty()
  nickname: string

  @ApiProperty({ description: '프로필 사진 URL', example: null, oneOf: [{ type: 'string' }, { type: 'null' }] })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  imageUrl!: string | null
}
