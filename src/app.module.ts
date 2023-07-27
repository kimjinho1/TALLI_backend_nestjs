import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { CoreModule } from './core/core.module'

export const assetsPath = join(process.cwd(), 'assets')

@Module({
  imports: [
    CoreModule,
    ServeStaticModule.forRoot({
      rootPath: assetsPath
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
