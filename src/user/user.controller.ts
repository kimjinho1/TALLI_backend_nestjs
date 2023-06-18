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
import { AddUserRequestDto, updateJobOfInterestRequestDto, UpdateUserRequestDto, UserIdRequestDto } from './dto/request'
import { AddUserResponseDto } from './dto/response'
import { UserService } from './user.service'

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
  @HttpCode(HttpStatus.OK)
  async getAllNickname(): Promise<string[]> {
    return await this.userService.getAllNickname()
  }

  @ApiOperation({ summary: '개별 회원 정보 보기', description: 'userId와 매칭되는 유저의 정보를 반환합니다.' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: '유저 ID',
    type: String
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: AddUserResponseDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserByUserId(@Param('userId') userId: string): Promise<AddUserResponseDto> {
    return await this.userService.getUserById(userId)
  }

  @ApiOperation({ summary: '회원 정보 추가', description: 'User, CurrentJobDetail, JobOfInterest을 생성합니다.' })
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
  async addUser(@Body() dto: AddUserRequestDto): Promise<AddUserResponseDto> {
    return await this.userService.addUser(dto)
  }

  @ApiOperation({ summary: '회원 프로필 수정', description: '회원 프로필(닉네임, 프로필 사진)을 수정합니다.' })
  @ApiBody({ type: AddUserRequestDto })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: AddUserResponseDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Patch('/profile/:userId')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('userId') userId: string, @Body() dto: UpdateUserRequestDto): Promise<AddUserResponseDto> {
    return await this.userService.updateUser(userId, dto)
  }

  @ApiOperation({ summary: '회원 관심 직군 수정', description: '회원 관심 직군을 수정합니다.' })
  @ApiBody({ type: updateJobOfInterestRequestDto })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: AddUserResponseDto
  })
  @ApiConflictResponse({
    description: '닉네임이 이미 존재하는 경우, 409 Conflict를 응답합니다.'
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Patch('/interest/:userId')
  @HttpCode(HttpStatus.OK)
  async updateJobOfInterest(
    @Param('userId') userId: string,
    @Body() dto: updateJobOfInterestRequestDto
  ): Promise<AddUserResponseDto> {
    return await this.userService.updateJobOfInterest(userId, dto.jobOfInterestList)
  }

  @ApiOperation({ summary: '회원 정보 삭제', description: 'userId와 매칭되는 유저의 정보를 삭제합니다.' })
  @ApiBody({ type: UserIdRequestDto })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: AddUserResponseDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Body() dto: UserIdRequestDto): Promise<null> {
    await this.userService.deleteUser(dto.userId)
    return null
  }
}
