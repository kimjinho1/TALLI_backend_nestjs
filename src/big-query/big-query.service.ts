import { BigQuery } from '@google-cloud/bigquery'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ErrorMessages } from 'src/common/exception/error.messages'
import { PositionDto } from './dto/response'

@Injectable()
export class BigQueryService {
  private bigQueryPositionTable = `${process.env.PROJECT_ID}.${process.env.DATASET_ID}.position`

  private readonly bigquery = new BigQuery({
    keyFilename: process.env.KEY_PATH,
    projectId: process.env.PROJECT_ID
  })

  async runQuery(query: string) {
    const options = {
      query,
      location: 'asia-northeast3'
    }

    try {
      const [rows] = await this.bigquery.query(options)
      return rows
    } catch (error) {
      throw new InternalServerErrorException('BigQuery 테이블에 스키마가 존재하지 않는 것 같습니다.')
    }
  }

  /** BigQuery에 캐싱된 모든 채용 공고 데이터 반환 */
  async getPositions(): Promise<PositionDto[]> {
    const query = `
      SELECT *
      FROM \`${this.bigQueryPositionTable}\`
    `

    return await this.runQuery(query)
  }

  /** BigQuery에 캐싱된 특정 채용 공고 데이터 반환 */
  async getPosition(id: string): Promise<PositionDto> {
    const query = `
            SELECT *
            FROM \`${this.bigQueryPositionTable}\`
            WHERE id = '${id}'
        `

    const position = await this.runQuery(query)
    if (position.length === 0) {
      throw new NotFoundException(ErrorMessages.JOB_NOTICE_NOT_FOUND)
    }

    return position[0]
  }

  /** BigQuery에 캐싱된 특정 채용 공고 데이터 삭제 */
  async deletePosition(id: string): Promise<PositionDto> {
    const query = `
      DELETE FROM \`${this.bigQueryPositionTable}\`
      WHERE id = '${id}'
    `
    const position = await this.getPosition(id)

    await this.bigquery.query(query)

    return position
  }
}
