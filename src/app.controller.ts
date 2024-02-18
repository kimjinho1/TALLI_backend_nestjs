import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { v4 as uuidv4 } from 'uuid'
import { StorageService } from './storage/storage.service'

@Controller()
export class AppController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getHello(): string {
    // return 'Talli Backend'
    return '자동 배포 테스트 용'
  }

  @Post('/image/:path')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        files: 1,
        fileSize: 5000 * 5000
      }
    })
  )
  async imageUpload(
    @Param('path') path: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5000 * 5000 }), new FileTypeValidator({ fileType: 'image/*' })]
      })
    )
    file: Express.Multer.File
  ) {
    const paths = ['job-notice', 'company', 'career', 'user']
    if (paths.includes(path) === false) {
      throw new BadRequestException('잘못된 저장 경로입니다.')
    }

    const uuid = uuidv4()
    const imagePath = `${path}/${uuid}.png`

    await this.storageService.save(imagePath, file.mimetype, file.buffer, [{ imageId: imagePath }])

    const result = {
      imageUrl: imagePath
    }

    return result
  }
}
