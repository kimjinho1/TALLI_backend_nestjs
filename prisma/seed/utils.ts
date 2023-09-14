import * as fs from 'fs'
import * as csv from 'csv-parser'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/** Load csv file */
export function readCSVFile(filePath: string): Promise<any[]> {
  const results: any[] = []

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath).on('error', error => reject(error))

    stream
      .pipe(csv())
      .on('data', data => {
        try {
          results.push(data)
        } catch (error) {
          console.error(`Error processing row: ${error}`)
        }
      })
      .on('end', () => resolve(results))
      .on('error', error => reject(error))
  })
}

/** Download image by image url */
export async function downloadImage(imageUrl: string, imageSavePath: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    fs.writeFile(imageSavePath, response.data, err => {
      if (err) {
        console.error(err)
      }
      console.log(`Image downloaded successfully! -> ${imageSavePath}`)
    })
  } catch (error) {
    console.error(`잘못된 이미지 경로입니다. -> ${imageUrl}`)
  }
}

/**
 * autoincrement 요소인 companyId에 값을 직적 대입을 한 상황
 * 그 이후에 자연스럽게 비는 숫자에 알아서 id를 채울줄 알았지만 그렇지 않았음
 * EX) companyId에 총 330개, 마지막 companyId에: 332일 때
 * 새로운 데이터가 저장되었을 때 companyId에 333을 넣는게 아니라
 * 2를 넣어버린다. autoincrement의 시퀸스가 자동이 아니라 직접 저장한 값들은
 * 기억을 못해서 생긴 문제다. 그렇기에 아래 함수처럼 시퀸스를 직접 업데이트 해줘야 한다.
 */
export async function updateCompanyAndJobNoticeIdSequence() {
  /*
  "" 은 postgresql 이 대소문자를 신경쓰지 않기 때문에 필요하다.
  데이터베이스에 저장된 테이블이 이름이 Company이기에 대문자 그대로 들어가게 해야함
  -> 그렇기에 '"Company"'

  max('company_id')를 사용하는 경우에는 PostgreSQL에서는 
  "company_id"라는 문자열과 숫자 1을 더하려고 하기 때문에 오류가 발생한다.
    const result = await prisma.$executeRaw`SELECT setval(
    pg_get_serial_sequence('"Company"', 'company_id'),
    coalesce((SELECT max('company_id') FROM "Company") + 1, 1),
    false
  )`
  */
  const company_id = await prisma.$executeRaw`SELECT setval(
  pg_get_serial_sequence('"Company"', 'company_id'),
  coalesce(max(company_id) + 1, 1),
  false
) FROM "Company"`

  const jobNoticeId = await prisma.$executeRaw`SELECT setval(
  pg_get_serial_sequence('"JobNotice"', 'job_notice_id'),
  coalesce(max(job_notice_id) + 1, 1),
  false
) FROM "JobNotice"`

  console.log('Company ID sequence update successfully:', company_id)
  console.log('JobNotice ID sequence update successfully:', jobNoticeId)
}

/** autoincrement 확인 */
export async function test() {
  const data = {
    companyName: 'test1234',
    logoUrl: 'images/company/test1234.png',
    companyType: '대학병원',
    employee: 6333,
    incorporation: new Date('1998-01-15T00:00:00.000Z'),
    companyLocation: '서울 종로구 대학로 102',
    companyWebsite: 'http://www.snuh.com'
  }

  const created_company = await prisma.company.create({
    data
  })
  console.log('id:', created_company.companyId)
}
