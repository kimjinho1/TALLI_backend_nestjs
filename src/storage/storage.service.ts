import { DownloadResponse, Storage } from '@google-cloud/storage'
import { Injectable } from '@nestjs/common'

class StorageFile {
  buffer: Buffer
  metadata: Map<string, string>
  contentType: string
}

@Injectable()
export class StorageService {
  private storage: Storage
  private bucket: string

  constructor() {
    const private_key = process.env.PRIVATE_KEY || ''
    const new_private_key = private_key.split(String.raw`\n`).join('\n')

    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: new_private_key
      }
    })

    this.bucket = process.env.STORAGE_MEDIA_BUCKET || 'talli_bucket'
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
