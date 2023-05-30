import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateUserDto } from './dto/CreateUser.dto'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '유저 생성' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(createUserDto)
  }
}
