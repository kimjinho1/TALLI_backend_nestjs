import { IsUUID } from 'class-validator'

export class UserIdRequestDto {
  @IsUUID()
  userId: string
}
