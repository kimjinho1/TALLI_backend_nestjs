import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import { Answer, Partner, Question, Review } from '@prisma/client'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/auth/role/role.guard'
import { Roles } from 'src/auth/role/roles.decorator'
import {
  PartnerInfoResponse,
  QuestionService,
  UserQuestionInfoResponse
} from 'src/core/application/service/question.service'
import {
  AddAnswerCommandDto,
  AddPartnerCommandDto,
  AddReviewCommandDto,
  RegisterQuestionCommandDto
} from './command/question'

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    summary: '모든 현직자 정보 조회',
    description: '모든 현직자 정보를 조회합니다.'
  })
  @ApiQuery({
    name: 'category',
    required: true,
    description: '카테고리',
    type: String
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type: AddPartnerCommandDto[]
  })
  @Get('/partner/list')
  async getPartners(@Query('category') category: string): Promise<Partner[]> {
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
    type: AddPartnerCommandDto
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

  @ApiOperation({
    summary: '질문 내역 보기',
    description: '질문 내역 보기.'
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type:
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserQuestion(@Req() req: Request): Promise<UserQuestionInfoResponse[]> {
    const userId = req.user.userId
    return await this.questionService.getUserQuestion(userId)
  }

  @ApiOperation({
    summary: '리뷰 추가',
    description: '사용자 리뷰를 추가합니다.'
  })
  @ApiBody({ type: AddReviewCommandDto })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.',
    type: AddReviewCommandDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 파트너 또는 질문인 경우, 404 Not Found를 응답합니다.'
  })
  @ApiBadRequestResponse({
    description: '이미 리뷰가 진행된 질문인 경우, 400 Bad Request를 응답합니다.'
  })
  @Post('review')
  @UseGuards(JwtAuthGuard)
  async addReview(@Req() req: Request, @Body() dto: AddReviewCommandDto): Promise<Review> {
    const userId = req.user.userId
    return await this.questionService.addReview(userId, dto)
  }

  /**
   * ADMIN
   */

  @ApiOperation({
    summary: '전체 질문 내용 보기',
    description: '전체 질문 내용을 조회합니다.'
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type: AddPartnerCommandDto
  })
  @Get('/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getQuestions(): Promise<Question[]> {
    return await this.questionService.getQuestions()
  }

  @ApiOperation({
    summary: '개별 질문 내용 보기',
    description: '개별 질문 내용을 조회합니다.'
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.'
    // type: AddPartnerCommandDto
  })
  @Get('/:questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getQuestion(@Param('questionId') questionId: number): Promise<Question> {
    return await this.questionService.getQuestion(questionId)
  }

  @ApiOperation({
    summary: '현직자 답변 추가',
    description: '현직자 답변을 추가합니다.'
  })
  @ApiBody({ type: AddAnswerCommandDto })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.'
    // type: AddPartnerCommandDto
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 질문인 경우, 404 Not Found를 응답합니다.'
  })
  @ApiBadRequestResponse({
    description: '답변이 이미 존재하는 경우, 400 Bad Request를 응답합니다.'
  })
  @Post('/answer/:questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async addAnswer(@Param('questionId') questionId: number, @Body() dto: AddAnswerCommandDto): Promise<Answer> {
    return await this.questionService.addAnswer(questionId, dto)
  }

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
