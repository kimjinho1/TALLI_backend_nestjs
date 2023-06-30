import {
  BadRequestException,
  ConsoleLogger,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { join } from 'path'
import { diskStorage } from 'multer'
import * as path from 'path'
import * as fs from 'fs'
import { assetsPath } from './app.module'
import { Console } from 'console'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Post('/image/:path')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(assetsPath, 'images', req.params.path)
          cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
          const uploadPath = path.join(assetsPath, 'images', req.params.path)
          console.log(uploadPath)
          fs.readdir(uploadPath, (err, files) => {
            if (err) {
              console.log(err)
            } else {
              const filename = `${files.length}${path.extname(file.originalname)}`
              cb(null, filename)
            }
          })
        }
      })
    })
  )
  async imageUpload(@Param('path') path: string, @UploadedFile() file: Express.Multer.File) {
    const paths = ['job-notice', 'company', 'career', 'user']
    if (paths.includes(path) === false) {
      throw new BadRequestException('잘못된 저장 경로입니다.')
    }
    const imageUrl = `${process.env.BACKEND_URL}/images/${path}/${file.filename}`
    return imageUrl
  }
}
