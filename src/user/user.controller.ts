import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AddUserDto, IAddUserResponse } from './dto'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '회원 정보 추가' })
  async addUser(@Body() addUserDto: AddUserDto): Promise<IAddUserResponse> {
    return await this.userService.addUser(addUserDto)
  }

  @Get('/nickname')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '전체 회원 닉네임 목록 보기' })
  async getAllNickname(): Promise<string[]> {
    return await this.userService.getAllNickname()
  }
}
