import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Answer, Partner, Question, Review } from '@prisma/client'
import * as lo from 'lodash'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { QuestionRepository } from 'src/core/adapter/repository/question.repository'
import {
  AddAnswerCommandDto,
  AddPartnerCommandDto,
  AddReviewCommandDto,
  RegisterQuestionCommandDto
} from 'src/core/adapter/web/command/question'

export type AllPartnerInfoResponse = (Partner & {
  responseRate: number
})[]

export type LatestReviews = {
  nickname: string
  job: string
  review: string
}[]

export type PartnerInfoResponse = Partner & {
  responseRate: number
  latestReviews: LatestReviews
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

const categories = {
  health_manager: '보건관리자',
  research_nurse: '임상연구',
  insurance: '보험심사',
  planner: '기획 / 마케팅',
  public_institution: '공공기관',
  public_official: '공무원',
  medical_writer: '메디컬라이터',
  salesman: '영업직',
  mental_health_nurse: '정신건강간호사',
  claim_adjuster: '손해사정사'
}

@Injectable()
export class QuestionService {
  constructor(private readonly repository: QuestionRepository) {}

  /** 모든 현직자 정보 보기 */
  async getPartners(category: string): Promise<AllPartnerInfoResponse> {
    /** 카테고리가 있는 경우 올바른 카테고리인지 확인 -> 에러일 시 400 에러 코드 반환 */
    if (category && !lo.has(categories, category)) {
      throw new BadRequestException(ErrorMessages.WRONG_CATEGORY)
    }

    /** 카테고리가 없으면 전체를 조회해야하기에 undefined로 저장 */
    const matchedCategory = categories[category]

    const partners = await this.repository.getAllPartner(matchedCategory)
    const res = partners.map(partner => {
      const { receivedQuestions, answeredQuestions } = partner
      const responseRate = receivedQuestions > 0 ? (answeredQuestions / receivedQuestions) * 100 : 0
      return { ...partner, responseRate }
    })

    return res
  }

  /** 현직자 상세 정보 보기 */
  async getPartner(partnerId: string): Promise<PartnerInfoResponse> {
    /** 존재하는 파트너인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const partner = await this.getPartnerOrThrow(partnerId)

    const latestReviews = (await this.repository.getPartnerLatestReview(partnerId, 3)).map(review => ({
      nickname: review.user.nickname,
      job: review.user.currentJob,
      review: review.review
    }))

    const { receivedQuestions, answeredQuestions } = partner
    const responseRate = receivedQuestions > 0 ? (answeredQuestions / receivedQuestions) * 100 : 0

    const res = {
      ...partner,
      responseRate,
      latestReviews
    }

    return res
  }

  /** 물어보기 질문 등록 */
  async registerQuestions(userId: string, dto: RegisterQuestionCommandDto): Promise<Question[]> {
    const { partnerId, currentStatus, question1, question2 } = dto

    /** 존재하는 파트너인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getPartnerOrThrow(partnerId)

    const q1 = await this.repository.registerQuestion(userId, currentStatus, partnerId, question1)
    const q2 = await this.repository.registerQuestion(userId, currentStatus, partnerId, question2)

    await this.repository.updatePartnerReceivedQuestion(partnerId, 2)

    return [q1, q2]
  }

  /** 질문 내역 보기 */
  async getUserQuestion(userId: string): Promise<UserQuestionInfoResponse[]> {
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

  /** 사용자 리뷰 추가 */
  async addReview(userId: string, dto: AddReviewCommandDto): Promise<Review> {
    const { partnerId, questionId, review } = dto

    /** 존재하는 파트너인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getPartnerOrThrow(partnerId)

    /** 존재하는 질문인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const question = await this.getQuestionOrThrow(questionId)

    /** 답변이 완료된 질문인지 확인 -> 에러일 시 400 에러 코드 반환 */
    if (!question.isAnswered) {
      throw new BadRequestException(ErrorMessages.NOT_ANSWERED_QUESTION)
    }

    /** 리뷰가 없는 질문인지 확인 -> 에러일 시 400 에러 코드 반환 */
    if (question.isReviewed) {
      throw new BadRequestException(ErrorMessages.ALREADY_REVIEWED_QUESTION)
    }

    const createdReview = await this.repository.addReview(userId, partnerId, questionId, review)

    await this.repository.setQuestionAsReviewed(questionId)

    return createdReview
  }

  /** 전체 사용자 리뷰 조회 */
  async getReviews(number: number): Promise<LatestReviews> {
    if (number < 0) {
      throw new BadRequestException(ErrorMessages.ALREADY_REVIEWED_QUESTION)
    }

    const res = (await this.repository.getReviewsIncludeUserInfo(number)).map(review => ({
      nickname: review.user.nickname,
      job: review.user.currentJob,
      review: review.review
    }))

    return res
  }

  async getReviewsByPartnerId(partnerId: string, number: number): Promise<LatestReviews> {
    /** 존재하는 파트너인지 확인 -> 에러일 시 404 에러 코드 반환 */
    await this.getPartnerOrThrow(partnerId)

    if (number < 0) {
      throw new BadRequestException(ErrorMessages.ALREADY_REVIEWED_QUESTION)
    }

    const res = (await this.repository.getReviewsIncludeUserInfoByPartnerId(partnerId, number)).map(review => ({
      nickname: review.user.nickname,
      job: review.user.currentJob,
      review: review.review
    }))

    return res
  }

  /** 전체 질문 내역 보기 */
  async getQuestions(): Promise<Question[]> {
    return await this.repository.getQuestions()
  }

  /** 개별 질문 내역 보기 */
  async getQuestion(questionId: number): Promise<Question> {
    return await this.repository.getQuestion(questionId)
  }

  /** 현직자 답변 추가 */
  async addAnswer(questionId: number, dto: AddAnswerCommandDto): Promise<Answer> {
    const { answer } = dto

    /** 존재하는 질문인지 확인 -> 에러일 시 404 에러 코드 반환 */
    const { partnerId } = await this.getQuestionOrThrow(questionId)

    /** 이미 답변된 질문인지 확인 -> 에러일 시 400 에러 코드 반환 */
    await this.checkAlreadyAnsweredQuestion(questionId)

    const createdAnswer = await this.repository.addAnswer(questionId, answer)

    await this.repository.updatePartnerAnsweredQuestion(partnerId, 1)
    await this.repository.setQuestionAsAnswered(questionId)

    return createdAnswer
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

  /** 존재하는 질문인지 확인 -> 에러일 시 404 에러 코드 반환 */
  private async getQuestionOrThrow(questionId: number): Promise<Question> {
    try {
      return await this.repository.getQuestion(questionId)
    } catch (error) {
      throw new NotFoundException(ErrorMessages.QUESTION_NOT_FOUND)
    }
  }

  /** 이미 답변된 질문인지 확인 -> 에러일 시 400 에러 코드 반환 */
  private async checkAlreadyAnsweredQuestion(questionId: number): Promise<void> {
    const answer = await this.repository.getAnswer(questionId)
    if (answer) {
      throw new BadRequestException(ErrorMessages.ALREADY_ANSWERED_QUESTION)
    }
  }
}
