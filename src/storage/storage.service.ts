import { DownloadResponse, Storage } from '@google-cloud/storage'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

class StorageFile {
  buffer: Buffer
  metadata: Map<string, string>
  contentType: string
}

@Injectable()
export class StorageService {
  private storage: Storage
  private bucket: string

  constructor(private readonly configService: ConfigService) {
    const private_key = this.configService.get<string>('PRIVATE_KEY', '')
    const new_private_key = private_key.split(String.raw`\n`).join('\n')

    this.storage = new Storage({
      projectId: this.configService.get<string>('PROJECT_ID'),
      credentials: {
        client_email: this.configService.get<string>('CLIENT_EMAIL'),
        private_key: new_private_key
      }
    })

    this.bucket = this.configService.get<string>('STORAGE_MEDIA_BUCKET', 'talli_bucket')
  }

  async getFileCount(path: string): Promise<number> {
    try {
      const [files] = await this.storage.bucket(this.bucket).getFiles({ prefix: path })

      return files.length
    } catch (error) {
      console.error(`Error getting file count: ${error}`)
      throw error
    }
  }

  async save(path: string, contentType: string, media: Buffer, metadata: { [key: string]: string }[]) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {})
    const file = this.storage.bucket(this.bucket).file(path)
    const stream = file.createWriteStream()
    stream.on('finish', async () => {
      return await file.setMetadata({
        metadata: object
      })
    })
    stream.end(media)
  }

  async delete(path: string) {
    await this.storage.bucket(this.bucket).file(path).delete({ ignoreNotFound: true })
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage.bucket(this.bucket).file(path).download()
    const [buffer] = fileResponse
    const storageFile = new StorageFile()
    storageFile.buffer = buffer
    storageFile.metadata = new Map<string, string>()
    return storageFile
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [metadata] = await this.storage.bucket(this.bucket).file(path).getMetadata()
    const fileResponse: DownloadResponse = await this.storage.bucket(this.bucket).file(path).download()
    const [buffer] = fileResponse

    const storageFile = new StorageFile()
    storageFile.buffer = buffer
    storageFile.metadata = new Map<string, string>(Object.entries(metadata || {}) as Array<[string, string]>)
    storageFile.contentType = storageFile.metadata.get('contentType') || ''
    return storageFile
  }
}
