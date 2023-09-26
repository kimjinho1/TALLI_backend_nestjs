import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { UserInfoDto } from 'src/core/application/service/dto/user/response'
import { UserService } from 'src/core/application/service/user.service'
import { AddUserInfoCommand, DeleteUserCommand, UpdateUserCommand, updateJobOfInterestCommand } from './command/user'

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
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserInfo(@Req() req: Request): Promise<UserInfoDto> {
    return await this.userService.getUserInfo(req.user.userId)
  }

  @ApiOperation({
    summary: '회원 정보 추가',
    description: 'User, CurrentJobDetail, JobOfInterest을 생성합니다.'
  })
  @ApiBody({ type: AddUserInfoCommand })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.',
    type: AddUserInfoCommand
  })
  @ApiBadRequestResponse({
    description: '닉네임과 이메일이 이미 존재하는 경우, 400 Bad Request 를 응답합니다.'
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async addUserInfo(@Body() dto: AddUserInfoCommand): Promise<UserInfoDto> {
    return await this.userService.addUserInfo(dto)
  }

  @ApiOperation({
    summary: '회원 프로필 수정',
    description: '회원 프로필(닉네임, 프로필 사진)을 수정합니다.'
  })
  @ApiBody({ type: UpdateUserCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: UserInfoDto
  })
  @ApiBadRequestResponse({
    description: '닉네임이 이미 존재하는 경우, 400 Bad Request를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Patch('/profile/:userId')
  async updateUser(@Param('userId') userId: string, @Body() dto: UpdateUserCommand): Promise<UserInfoDto> {
    return await this.userService.updateUser(userId, dto)
  }

  @ApiOperation({
    summary: '회원 관심 직군 수정',
    description: '회원 관심 직군을 수정합니다.'
  })
  @ApiBody({ type: updateJobOfInterestCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: UserInfoDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Patch('/interest/:userId')
  async updateJobOfInterest(
    @Param('userId') userId: string,
    @Body() dto: updateJobOfInterestCommand
  ): Promise<UserInfoDto> {
    return await this.userService.updateJobOfInterest(userId, dto.jobOfInterestList)
  }

  @ApiOperation({
    summary: '회원 정보 삭제',
    description: 'userId와 매칭되는 유저의 정보를 삭제합니다.'
  })
  @ApiBody({ type: DeleteUserCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Delete()
  async deleteUser(@Body() dto: DeleteUserCommand): Promise<null> {
    await this.userService.deleteUser(dto.userId)
    return null
  }
}
