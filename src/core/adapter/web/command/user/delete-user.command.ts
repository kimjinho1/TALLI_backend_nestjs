import { IsUUID } from 'class-validator'

export class DeleteUserCommand {
  @IsUUID()
  userId: string
}
