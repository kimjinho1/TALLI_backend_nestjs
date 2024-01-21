import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { Partner } from '@prisma/client'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/auth/role/role.guard'
import { Roles } from 'src/auth/role/roles.decorator'
import { QuestionService } from 'src/core/application/service/question.service'
import { AddPartnerCommandDto } from './command/question'

@ApiTags('Quetsion')
@Controller('quetsion')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    summary: '파트너 정보 조회',
    description: '모든 파트너 정보를 조회합니다.'
  })
  @ApiOkResponse({
    description: '성공 시, 200 Ok를 응답합니다.',
    type: AddPartnerCommandDto
  })
  @Get('/partner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getPartner(): Promise<Partner[]> {
    return await this.questionService.getPartner()
  }

  @ApiOperation({
    summary: '파트너 정보 추가',
    description: '파트너 정보를 추가합니다.'
  })
  @ApiBody({ type: AddPartnerCommandDto })
  @ApiCreatedResponse({
    description: '성공 시, 201 Created를 응답합니다.',
    type: AddPartnerCommandDto
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
}
