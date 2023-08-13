import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { AddUserInfoCommand } from 'src/core/adapter/web/command/user/add-user.command'

export class UserInfoDto extends AddUserInfoCommand {
  @ApiProperty({ description: '유저 ID', example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string
}
