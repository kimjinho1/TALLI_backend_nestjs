import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateUserDto } from './dto/CreateUser.dto'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 추가 API', description: '유저를 생성' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    const user = await this.userService.createUser(createUserDto)
    console.log(user)
  }
}
