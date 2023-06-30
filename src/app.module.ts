import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { CompanyModule } from './company/company.module'
import { JobNoticeModule } from './job-notice/job-notice.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

export const assetsPath = join(process.cwd(), 'assets')

@Module({
  imports: [
    UserModule,
    CompanyModule,
    JobNoticeModule,
    ServeStaticModule.forRoot({
      rootPath: assetsPath
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
