import { Injectable } from '@nestjs/common'
import { Partner, Question } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { AddPartnerCommandDto } from '../web/command/question'

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
  async getPartnerLatestReview(partnerId: string): Promise<any | null> {
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
  async registerQuestion(userId: string, partnerId: string, question: string): Promise<Question> {
    return await this.prisma.question.create({
      data: {
        userId,
        partnerId,
        question
      }
    })
  }
}
