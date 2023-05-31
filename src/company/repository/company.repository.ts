import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class CompanyRepository {
  constructor(private prisma: PrismaService) {}
}
