import { Module } from '@nestjs/common'
import { CompanyController } from './company.controller'
import { CompanyService } from './company.service'
import { CompanyRepository } from './company.repository'
import { PrismaService } from 'prisma/prisma.service'

@Module({
  controllers: [CompanyController],
  providers: [PrismaService, CompanyService, CompanyRepository]
})
export class CompanyModule {}
