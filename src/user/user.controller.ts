import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConflictResponse, ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger'
import { AddUserRequestDto } from './dto/request'
import { AddUserResponseDto } from './dto/response'
import { UserService } from './user.service'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 추가', description: 'User, CurrentJobDetail, JobOfInterest을 생성합니다.' })
  @ApiBody({ type: AddUserRequestDto })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: AddUserResponseDto
  })
  @ApiConflictResponse({
    description: '닉네임이 이미 존재하는 경우, 409 Conflict를 응답합니다.'
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async addUser(@Body() addUserDto: AddUserRequestDto): Promise<AddUserResponseDto> {
    return await this.userService.addUser(addUserDto)
  }

  @ApiOperation({ summary: '전체 유저 닉네임 목록 보기', description: '모든 유저의 닉네임을 반환합니다.' })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: [String]
  })
  @Get('/nickname')
  @HttpCode(HttpStatus.OK)
  async getAllNickname(): Promise<string[]> {
    return await this.userService.getAllNickname()
  }
}
