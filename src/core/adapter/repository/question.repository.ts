import { Injectable } from '@nestjs/common'
import { Partner } from '@prisma/client'
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
}
