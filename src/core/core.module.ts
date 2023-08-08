import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { UserController } from './adapter/web/user.controller'
import { UserService } from './application/service/user.service'
import { UserRepository } from './adapter/repository/user.repository'

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository]
})
export class CoreModule {}
