import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import { CoreModule } from './core/core.module'

@Module({
  imports: [
    CoreModule,
    ServeStaticModule.forRoot({
      rootPath: process.cwd()
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
