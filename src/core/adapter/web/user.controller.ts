import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import {
  CodefCareerResponseDto,
  UserCareerInfoResponseDto,
  UserInfoDto
} from 'src/core/application/service/dto/user/response'
import { UserService } from 'src/core/application/service/user.service'
import {
  AddUserCareerInfoDto,
  AddUserInfoCommand,
  AuthenticateCodefFirstCommand,
  AuthenticateCodefSecondCommand,
  DeleteUserCommand,
  TwoWayInfo,
  UpdateJobOfInterestCommand,
  UpdateUserCommand
} from './command/user'

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
    summary: '회원 정보 업데이트',
    description: 'User, CurrentJobDetail, JobOfInterest을 생성합니다.'
  })
  @ApiBody({ type: AddUserInfoCommand })
  @ApiOkResponse({
    description: '성공 시, 200 OK를 응답합니다.',
    type: AddUserInfoCommand
  })
  @ApiBadRequestResponse({
    description: '닉네임과 이메일이 이미 존재하는 경우, 400 Bad Request 를 응답합니다.'
  })
  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(@Req() req: Request, @Body() dto: AddUserInfoCommand): Promise<UserInfoDto> {
    // return await this.userService.addUserInfo(dto)
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
  @ApiBody({ type: UpdateJobOfInterestCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: UserInfoDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Patch('/interest')
  @UseGuards(JwtAuthGuard)
  async updateJobOfInterest(@Req() req: Request, @Body() dto: UpdateJobOfInterestCommand): Promise<UserInfoDto> {
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

  /**
   * Career
   */

  @ApiOperation({
    summary: 'codef 1차 인증',
    description: 'codef API를 사용하여 1차 인증 시도 -> 사용자 간편 인증 진행'
  })
  @ApiBody({ type: AuthenticateCodefFirstCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: TwoWayInfo
  })
  @ApiBadRequestResponse({
    description: 'Codef 1차 인증 실패시 400 Bad Request 를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저인 경우 404 Bad Request 를 응답합니다.'
  })
  @Post('/career/auth/first')
  @UseGuards(JwtAuthGuard)
  async authenticateCodefFirst(@Req() req: Request, @Body() dto: AuthenticateCodefFirstCommand): Promise<TwoWayInfo> {
    return await this.userService.authenticateCodefFirst(req.user.userId, dto)
  }

  @ApiOperation({
    summary: 'codef 2차 인증',
    description: 'codef API를 사용하여 간편 인증 완료되었는지 확인 -> 경력 정보 조회'
  })
  @ApiBody({ type: AuthenticateCodefSecondCommand })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: [CodefCareerResponseDto]
  })
  @ApiBadRequestResponse({
    description: 'Codef 1차 인증이 정상적으로 완료되지 않은 경우 400 Bad Request 를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저인 경우 404 Bad Request 를 응답합니다.'
  })
  @Post('/career/auth/second')
  @UseGuards(JwtAuthGuard)
  async authenticateCodefSecond(
    @Req() req: Request,
    @Body() dto: AuthenticateCodefSecondCommand
  ): Promise<CodefCareerResponseDto[]> {
    return await this.userService.authenticateCodefSecond(req.user.userId, dto)
  }

  @ApiOperation({
    summary: '유저 인증 경력 정보 조회',
    description: '유저의 인증된 경력을 조회합니다'
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: [UserCareerInfoResponseDto]
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저인 경우 404 Bad Request 를 응답합니다.'
  })
  @Get('/career')
  @UseGuards(JwtAuthGuard)
  async getUserCareerInfo(@Req() req: Request): Promise<UserCareerInfoResponseDto[]> {
    return await this.userService.getUserCareerInfo(req.user.userId)
  }

  @ApiOperation({
    summary: '유저 인증 경력 정보 저장',
    description: 'codef API를 사용하여 유저의 인증된 경력을 저장합니다'
  })
  @ApiBody({ type: AddUserCareerInfoDto })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type: User
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저인 경우 404 Bad Request 를 응답합니다.'
  })
  @Post('/career')
  @UseGuards(JwtAuthGuard)
  async addUserCareerInfo(@Req() req: Request, @Body() dto: AddUserCareerInfoDto): Promise<User> {
    return await this.userService.addUserCareerInfo(req.user.userId, dto)
  }
}
