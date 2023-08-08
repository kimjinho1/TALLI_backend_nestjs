import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiConflictResponse,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam
} from '@nestjs/swagger'
import { UserInfoDto } from 'src/core/application/service/dto/user/response'
import { UserService } from 'src/core/application/service/user.service'
import { AddUserInfoCommand } from './command/user'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '전체 유저 닉네임 목록 보기', description: '모든 유저의 닉네임을 반환합니다.' })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: [String]
  })
  @Get('/nickname')
  getUserNicknames(): Promise<string[]> {
    return this.userService.getUserNicknames()
  }

  @ApiOperation({
    summary: '개별 회원 정보 보기',
    description: 'userId와 매칭되는 유저의 정보를 반환합니다.'
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: '유저 ID',
    type: String
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: UserInfoDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserInfo(@Param('userId') userId: string): Promise<UserInfoDto> {
    return await this.userService.getUserInfo(userId)
  }

  @ApiOperation({
    summary: '회원 정보 추가',
    description: 'User, CurrentJobDetail, JobOfInterest을 생성합니다.'
  })
  @ApiBody({ type: AddUserInfoCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: AddUserInfoCommand
  })
  @ApiConflictResponse({
    description: '닉네임이 이미 존재하는 경우, 409 Conflict를 응답합니다.'
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async addUserInfo(@Body() dto: AddUserInfoCommand): Promise<UserInfoDto> {
    return await this.userService.addUserInfo(dto)
  }
}
