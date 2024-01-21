import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
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
import { Partner, Question } from '@prisma/client'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/auth/role/role.guard'
import { Roles } from 'src/auth/role/roles.decorator'
import { PartnerInfoResponse, QuestionService } from 'src/core/application/service/question.service'
import { AddPartnerCommandDto, RegisterQuestionCommandDto } from './command/question'

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    summary: '모든 현직자 정보 조회',
    description: '모든 현직자 정보를 조회합니다.'
  })
  @ApiParam({
    name: 'category',
    required: true,
    description: '카테고리',
    type: String
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type: AddPartnerCommandDto[]
  })
  @Get('/partners/:category')
  async getPartners(@Param('category') category: string): Promise<Partner[]> {
    return await this.questionService.getPartners(category)
  }

  @ApiOperation({
    summary: '현직자 상세 정보 조회',
    description: '현직자 상세 정보를 조회합니다.'
  })
  @ApiParam({
    name: 'partnerId',
    required: true,
    description: '현직자 ID',
    type: String
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type: AddPartnerCommandDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 현직자 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Get('/partner/:partnerId')
  async getPartner(@Param('partnerId') partnerId: string): Promise<PartnerInfoResponse> {
    return await this.questionService.getPartner(partnerId)
  }

  @ApiOperation({
    summary: '물어보기 질문 등록',
    description: '물어보기 질문을 등록합니다.'
  })
  @ApiBody({ type: AddPartnerCommandDto })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.',
    type: RegisterQuestionCommandDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 현직자 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async registerQuestion(@Req() req: Request, @Body() dto: RegisterQuestionCommandDto): Promise<Question[]> {
    const userId = req.user.userId
    return await this.questionService.registerQuestions(userId, dto)
  }

  // @ApiOperation({
  //   summary: '현직자 상세 정보 조회',
  //   description: '현직자 상세 정보를 조회합니다.'
  // })
  // @ApiParam({
  //   name: 'partnerId',
  //   required: true,
  //   description: '현직자 ID',
  //   type: String
  // })
  // @ApiOkResponse({
  //   description: '성공 시, 200 Ok를 응답합니다.'
  //   // type:
  // })
  // @ApiNotFoundResponse({
  //   description: '존재하지 않는 현직자 ID인 경우, 404 Not Found를 응답합니다.'
  // })
  // @Get('/partner/:partnerId')
  // @UseGuards(JwtAuthGuard)
  // async getQuestion(@Req() req: Request): Promise<any> {
  //   const userId = req.user.userId
  //   return await this.questionService.getQuestion(userId)
  // }

  @ApiOperation({
    summary: '현직자 정보 추가',
    description: '현직자 정보를 추가합니다.'
  })
  @ApiBody({ type: AddPartnerCommandDto })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.'
    // type: AddPartnerCommandDto
  })
  @ApiBadRequestResponse({
    description: '닉네임이 이미 존재하는 경우, 400 Bad Request를 응답합니다.'
  })
  @Post('/partner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async addPartner(@Req() req: Request, @Body() dto: AddPartnerCommandDto): Promise<Partner> {
    return await this.questionService.addPartner(dto)
  }

  @ApiOperation({
    summary: '현직자 정보 삭제',
    description: '현직자 정보를 삭제합니다.'
  })
  @ApiParam({
    name: 'partnerId',
    required: true,
    description: '현직자 ID',
    type: String
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type: AddPartnerCommandDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 현직자 ID인 경우, 404 Not Found를 응답합니다.'
  })
  @Delete('/partner/:partnerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deletePartner(@Param('partnerId') partnerId: string): Promise<Partner> {
    return await this.questionService.deletePartner(partnerId)
  }
}
