import { BadRequestException, Injectable } from '@nestjs/common'
import { Partner } from '@prisma/client'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { QuestionRepository } from 'src/core/adapter/repository/question.repository'
import { AddPartnerCommandDto } from 'src/core/adapter/web/command/question'

@Injectable()
export class QuestionService {
  constructor(private readonly repository: QuestionRepository) {}

  /** 모든 파트저 정보 보기 */
  async getPartner(category: string): Promise<Partner[]> {
    return await this.repository.getPartner(category)
  }

  /** partner 정보 추가 */
  async addPartner(dto: AddPartnerCommandDto): Promise<any> {
    /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
    await this.checkPartnerDuplicateByNickname(dto.nickname)

    /** admin 유저 정보 생성 */
    return await this.repository.createPartner(dto)
  }

  /**
   * UTILS
   */

  /** 닉네임 중복 처리 -> 에러일 시 400 에러 코드 반환 */
  private async checkPartnerDuplicateByNickname(nickname: string): Promise<void> {
    const user = await this.repository.getPartnerByNickname(nickname)
    if (user) {
      throw new BadRequestException(ErrorMessages.NICKNAME_ALREADY_EXISTS)
    }
  }
}
