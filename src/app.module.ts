import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { CoreModule } from './core/core.module'
import { StorageModule } from './storage/storage.module'
import { BigQueryModule } from './big-query/big-query.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      isGlobal: true
    }),
    CoreModule,
    StorageModule,
    BigQueryModule,
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule {}
