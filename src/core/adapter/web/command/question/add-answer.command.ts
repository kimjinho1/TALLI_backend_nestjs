import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddAnswerCommandDto {
  @ApiProperty({ description: '답변', example: '노력하십시오' })
  @IsString()
  @IsNotEmpty()
  answer: string
}
