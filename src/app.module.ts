import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { CompanyModule } from './company/company.module'
import { JobNoticeModule } from './job-notice/job-notice.module';

@Module({
  imports: [UserModule, CompanyModule, JobNoticeModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
