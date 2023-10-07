import { Module } from '@nestjs/common'
import { BigQueryController } from './big-query.controller'
import { BigQueryService } from './big-query.service'

@Module({
  controllers: [BigQueryController],
  providers: [BigQueryService]
})
export class BigQueryModule {}
