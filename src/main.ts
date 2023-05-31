import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { ResponseWrapperInterceptor } from './response-wrapper/response-wrapper.interceptor'

/*
[] 전체 채용 공고 보기
[] 개별 채용 공고 보기
[] 채용 공고 북마크 증감
[] 북마크한 채용 공고 보기
[] 채용 공고 추가
[] 채용 공고 수정
[] 채용 공고 삭제
[] 전체 회사 정보 보기
[] 개별 회사 정보 보기
[] 회사 정보 추가
[] 회사 정보 수정
[] 회사 정보 삭제
[] 이미지 업로드
[] 채용 공고 검색
[] 검색 자동 완성 목록
[] 회원 정보 수정
[V] 회원 정보 추가
[] 회원 정보 삭제
[] FCM 푸시 알림 추가
[] FCM 푸시 알림 수정
[] FCM 푸시 알림 삭제
[] 전체 FCM 푸시 알림 보기
*/

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  // app.useGlobalInterceptors(new ResponseWrapperInterceptor())
  app.useGlobalInterceptors(new ResponseWrapperInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(3000)
}

console.log('http://localhost:3000')
bootstrap()
