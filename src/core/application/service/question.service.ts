import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Partner, Question } from '@prisma/client'
import * as lo from 'lodash'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { QuestionRepository } from 'src/core/adapter/repository/question.repository'
import { AddPartnerCommandDto, RegisterQuestionCommandDto } from 'src/core/adapter/web/command/question'

type LatestReviews = {
  nickname: string
  job: string
  review: string
}

export type PartnerInfoResponse = Partner & {
  latestReviews: LatestReviews[]
}

export type UserQuestionInfoResponse = {
  question: string
  questionDate: string
  partnerImageUrl: string | null
  partnerNickname: string
  partnerJob: string
  answer: string | null
  answerDate: string | null
}

const categories = [
  '보건관리자',
  '임상연구',
  '보험심사',
  '기획 / 마케팅',
  '공공기관',
  '공무원',
  '메디컬라이터',
  '영업직',
  '정신건강간호사',
  '손해사정사'
]

@Injectable()
export class QuestionService {
  constructor(private readonly repository: QuestionRepository) {}

  /** 모든 현직자 정보 보기 */
  async getPartners(category: string): Promise<Partner[]> {
    /** 올바른 카테고리인지 확인 -> 에러일 시 400 에러 코드 반환 */
    if (!lo.includes(categories, category)) {
      throw new BadRequestException(ErrorMessages.WRONG_CATEGORY)
    }

    return await this.repository.getAllPartner(category)
  }

  /** 현직자 상세 정보 보기 */
  async getPartner(partnerId: string): Promise<PartnerInfoResponse> {
    /** 존재하는 파트너인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const partner = await this.getPartnerOrThrow(partnerId)

    const latestReviews = (await this.repository.getPartnerLatestReview(partnerId)).map(review => ({
      nickname: review.user.nickname,
      job: review.user.currentJob,
      review: review.review
    }))

    const res = {
      ...partner,
      latestReviews
    }

    return res
  }

  /** 물어보기 질문 등록 */
  async registerQuestions(userId: string, dto: RegisterQuestionCommandDto): Promise<Question[]> {
    const { partnerId, question1, question2 } = dto

    /** 존재하는 파트너인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getPartnerOrThrow(partnerId)

    const q1 = await this.repository.registerQuestion(userId, partnerId, question1)
    const q2 = await this.repository.registerQuestion(userId, partnerId, question1)

    return [q1, q2]
  }

  /** 질문 내역 보기 */
  async getQuestion(userId: string): Promise<any> {
    const userQuestionInfos = await this.repository.getUserQuestionInfos(userId)

    const res = userQuestionInfos.map(question => ({
      question: question.question,
      questionDate: question.createdAt.toISOString(),
      partnerImageUrl: question.partner.imageUrl,
      partnerNickname: question.partner.nickname,
      partnerJob: question.partner.job,
      answer: question.answer?.answer ?? null,
      answerDate: question.answer?.createdAt.toISOString() ?? null
    }))

    return res
  }

  /** 현직자 정보 추가 */
  async addPartner(dto: AddPartnerCommandDto): Promise<Partner> {
    /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    await this.checkPartnerDuplicateByNickname(dto.nickname)

    /** admin 유저 정보 생성 */
    return await this.repository.createPartner(dto)
  }

  /** 현직자 정보 삭제 */
  async deletePartner(partnerId: string): Promise<Partner> {
    await this.getPartner(partnerId)

    return await this.repository.deletePartner(partnerId)
  }

  /**
   * UTILS
   */
  /** 존재하는 파트너인지 확인 -> 에러일 시 404 에러 코드 반환 */
  private async getPartnerOrThrow(partnerId: string): Promise<Partner> {
    try {
      return await this.repository.getPartner(partnerId)
    } catch (error) {
      throw new NotFoundException(ErrorMessages.PARTNER_NOT_FOUND)
    }
  }

  /** 현직자 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
  private async checkPartnerDuplicateByNickname(nickname: string): Promise<void> {
    const partner = await this.repository.getPartnerByNickname(nickname)
    if (partner) {
      throw new BadRequestException(ErrorMessages.NICKNAME_ALREADY_EXISTS)
    }
  }

  /** 질문 등록 */
  private async registerQuestion(userId: string, partnerId, question): Promise<Question> {
    return await this.repository.registerQuestion(userId, partnerId, question)
  }
}
