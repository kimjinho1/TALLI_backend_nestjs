import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class JobNoticeRepository {
  constructor(private prisma: PrismaService) {}
}
