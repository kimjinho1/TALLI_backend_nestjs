import { Injectable } from '@nestjs/common'
import { Answer, Partner, Question, Review } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { AddPartnerCommandDto } from '../web/command/question'
import { ReviewInfosDto, UserQuestionInfosDto } from './dto/question'

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
  async getAllPartner(category: string | undefined): Promise<Partner[]> {
    return await this.prisma.partner.findMany({
      where: {
        category: category || undefined
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

  /** 현직자의 최신 리뷰 3개 조회 */
  async getPartnerLatestReview(partnerId: string, take: number): Promise<ReviewInfosDto> {
    return await this.prisma.review.findMany({
      where: {
        partnerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take,
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

  /** 전체 사용자 리뷰 조회 */
  async getReviewsIncludeUserInfo(take: number | undefined): Promise<ReviewInfosDto> {
    return await this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take,
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

  /** 파트너에게 할당된 질문들 조회 */
  async getPartnerQuestions(partnerId: string): Promise<Question[]> {
    return await this.prisma.question.findMany({
      where: {
        partnerId
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

  /** 파트너 할당된 질문 개수 update */
  async updatePartnerReceivedQuestion(partnerId: string, cnt: number): Promise<Partner> {
    return await this.prisma.partner.update({
      where: {
        partnerId
      },
      data: {
        receivedQuestions: { increment: cnt }
      }
    })
  }

  /** 파트너 할당된 질문 개수 +1 */
  async updatePartnerAnsweredQuestion(partnerId: string, cnt: number): Promise<Partner> {
    return await this.prisma.partner.update({
      where: {
        partnerId
      },
      data: {
        answeredQuestions: { increment: cnt }
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

  /** 리뷰 등록 */
  async addReview(userId: string, partnerId: string, questionId: number, review: string): Promise<Review> {
    return await this.prisma.review.create({
      data: {
        userId,
        partnerId,
        questionId,
        review
      }
    })
  }

  /** 전체 질문 내역 조회 */
  async getQuestions(): Promise<Question[]> {
    return await this.prisma.question.findMany()
  }

  /** 개별 질문 내역 조회 */
  async getQuestion(questionId: number): Promise<Question> {
    return await this.prisma.question.findUniqueOrThrow({
      where: {
        questionId
      }
    })
  }

  /** 답변 조회 */
  async getAnswer(questionId: number): Promise<Answer | null> {
    return await this.prisma.answer.findUnique({
      where: {
        questionId
      }
    })
  }

  /** 답변 추가 */
  async addAnswer(questionId: number, answer: string): Promise<Answer> {
    return await this.prisma.answer.create({
      data: {
        questionId,
        answer
      }
    })
  }

  /** 질문에 답변 완료 체크 */
  async setQuestionAsAnswered(questionId: number): Promise<Question> {
    return await this.prisma.question.update({
      where: {
        questionId
      },
      data: {
        isAnswered: true
      }
    })
  }

  /** 질문에 리뷰 완료 체크 */
  async setQuestionAsReviewed(questionId: number): Promise<Question> {
    return await this.prisma.question.update({
      where: {
        questionId
      },
      data: {
        isReviewed: true
      }
    })
  }
}
