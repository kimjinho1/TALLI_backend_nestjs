import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
// import { Roles } from './roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    // const roles = this.reflector.get(Roles, context.getHandler())

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const { userId } = request.user
    const { role } = await this.userRepository.getUserLevel(userId)
    console.log(role)

    const hasRole = () => roles.includes(role)

    return hasRole()
  }
}
