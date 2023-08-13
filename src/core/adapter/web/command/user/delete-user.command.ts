import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteUserCommand {
  @ApiProperty({ description: '유저 ID', example: 'UUID' })
  @IsUUID()
  userId: string
}
