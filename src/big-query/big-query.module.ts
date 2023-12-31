import { Module } from '@nestjs/common'
import { BigQueryController } from './big-query.controller'
import { BigQueryService } from './big-query.service'
import { UserRepository } from 'src/core/adapter/repository/user.repository'
import { PrismaService } from 'prisma/prisma.service'

@Module({
  controllers: [BigQueryController],
  providers: [BigQueryService, PrismaService, UserRepository]
})
export class BigQueryModule {}
