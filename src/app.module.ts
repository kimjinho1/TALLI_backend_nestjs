import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { CoreModule } from './core/core.module'
import { StorageModule } from './storage/storage.module'
import { BigQueryModule } from './big-query/big-query.module'

@Module({
  imports: [CoreModule, StorageModule, BigQueryModule],
  controllers: [AppController]
})
export class AppModule {}
