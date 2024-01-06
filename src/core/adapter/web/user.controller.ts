import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common'
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
import { Roles } from 'src/auth/role/roles.decorator'
import { RolesGuard } from 'src/auth/role/role.guard'

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
  @Patch()
  async addUserInfo(@Body() dto: AddUserInfoCommand): Promise<UserInfoDto> {
    return await this.userService.addUserInfo(dto)
  }

  @Post('admin')
  async addAdminUserInfo(@Body() dto: any): Promise<UserInfoDto> {
    return await this.userService.addUserInfo(dto)
  }

  @Patch('signup')
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(@Req() req: Request, @Body() dto: AddUserInfoCommand): Promise<UserInfoDto> {
    return await this.userService.updateUserInfo(req.user.userId, dto)
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
  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req: Request, @Body() dto: UpdateUserCommand): Promise<UserInfoDto> {
    return await this.userService.updateUser(req.user.userId, dto)
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
  @Patch('/interest')
  @UseGuards(JwtAuthGuard)
  async updateJobOfInterest(@Req() req: Request, @Body() dto: updateJobOfInterestCommand): Promise<UserInfoDto> {
    return await this.userService.updateJobOfInterest(req.user.userId, dto.jobOfInterestList)
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
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: Request): Promise<null> {
    await this.userService.deleteUser(req.user.userId)
    return null
  }
}