import { Storage } from '@google-cloud/storage'

export class SeedStorage {
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
}
