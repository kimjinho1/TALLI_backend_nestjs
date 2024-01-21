import { Injectable } from '@nestjs/common'
import { Partner } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { AddPartnerCommandDto } from '../web/command/question'

@Injectable()
export class QuestionRepository {
  constructor(private prisma: PrismaService) {}

  /** nickname으로 파트너 찾기 */
  async getPartnerByNickname(nickname: string): Promise<Partner | null> {
    return await this.prisma.partner.findFirst({
      where: {
        nickname
      }
    })
  }

  /** 모든 파트너 조회 */
  async getPartner(): Promise<Partner[]> {
    return await this.prisma.partner.findMany()
  }

  /** 파트너 생성 */
  async createPartner(partnerData: AddPartnerCommandDto): Promise<Partner> {
    const { recommendation, ...rest } = partnerData
    return await this.prisma.partner.create({
      data: {
        ...rest,
        recommendation: recommendation.join('|')
      }
    })
  }
}
