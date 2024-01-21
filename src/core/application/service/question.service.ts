import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Partner } from '@prisma/client'
import * as lo from 'lodash'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { QuestionRepository } from 'src/core/adapter/repository/question.repository'
import { AddPartnerCommandDto } from 'src/core/adapter/web/command/question'

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
    if (!lo.includes(categories, category)) {
      throw new BadRequestException(ErrorMessages.WRONG_CATEGORY)
    }

    return await this.repository.getAllPartner(category)
  }

  /** 현직자 상세 정보 보기 */
  async getPartner(partnerId: string): Promise<any> {
    const partner = await this.getPartnerOrThrow(partnerId)

    const latestReviews = await this.repository.getPartnerLatestReview(partnerId)

    const res = {
      ...partner,
      latestReviews: latestReviews
    }

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
}
