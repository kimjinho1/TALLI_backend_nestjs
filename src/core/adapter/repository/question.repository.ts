import { Injectable } from '@nestjs/common'
import { Partner, Question } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { AddPartnerCommandDto } from '../web/command/question'
import { PartnerInfosDto, UserQuestionInfosDto } from './dto/question'

@Injectable()
export class QuestionRepository {
  constructor(private prisma: PrismaService) {}

  /** nickname으로 현직자 찾기 */
  async getPartnerByNickname(nickname: string): Promise<Partner | null> {
    return await this.prisma.partner.findFirst({
      where: {
        nickname
      }
    })
  }

  /** 모든 현직자 조회 */
  async getAllPartner(category: string): Promise<Partner[]> {
    return await this.prisma.partner.findMany({
      where: {
        category
      }
    })
  }

  /** 현직자 조회 */
  async getPartner(partnerId: string): Promise<Partner> {
    return await this.prisma.partner.findUniqueOrThrow({
      where: {
        partnerId
      }
    })
  }

  /** 현직자 생성 */
  async createPartner(partnerData: AddPartnerCommandDto): Promise<Partner> {
    const { recommendation, ...rest } = partnerData
    return await this.prisma.partner.create({
      data: {
        ...rest,
        recommendation: recommendation.join('|')
      }
    })
  }

  /** 현직자 삭제 */
  async deletePartner(partnerId: string): Promise<Partner> {
    return await this.prisma.partner.delete({
      where: {
        partnerId
      }
    })
  }

  /** 현직자의 최신 리뷰 1개 조회 */
  async getPartnerLatestReview(partnerId: string): Promise<PartnerInfosDto> {
    return await this.prisma.review.findMany({
      where: {
        partnerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      select: {
        review: true,
        user: {
          select: {
            nickname: true,
            currentJob: true
          }
        }
      }
    })
  }

  /** 질문 등록 */
  async registerQuestion(
    userId: string,
    currentStatus: string,
    partnerId: string,
    question: string
  ): Promise<Question> {
    return await this.prisma.question.create({
      data: {
        userId,
        partnerId,
        currentStatus,
        question
      }
    })
  }

  /** 유저 질문 내역 조회 */
  async getUserQuestionInfos(userId: string): Promise<UserQuestionInfosDto> {
    return await this.prisma.question.findMany({
      where: {
        userId
      },
      select: {
        question: true,
        createdAt: true,
        partner: {
          select: {
            imageUrl: true,
            nickname: true,
            job: true
          }
        },
        answer: {
          select: {
            answer: true,
            createdAt: true
          }
        }
      }
    })
  }
}
