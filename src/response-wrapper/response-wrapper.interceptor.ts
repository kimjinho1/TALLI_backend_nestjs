import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

interface ResponseWrapper<T> {
  data: T
}

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<T, ResponseWrapper<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map(body => {
        const wrappedData: ResponseWrapper<T> = {
          data: body
        }
        return wrappedData
      })
    )
  }
}
