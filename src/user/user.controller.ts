import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AddUserDto, AddUserResponseType } from './dto/CreateUser.dto'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '유저 추가' })
  async addUser(@Body() addUserDto: AddUserDto): Promise<AddUserResponseType> {
    return await this.userService.addUser(addUserDto)
  }
}
