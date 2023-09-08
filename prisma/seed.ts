import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'csv-parser'
import { PrismaClient } from '@prisma/client'
import { Company } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()
const imageDirPath = path.join(process.cwd(), 'images')

// CSV 파일을 읽는 함수
function readCSVFile(filePath: string): Promise<any[]> {
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

async function createDefaultJobs() {
  const titles = [
    '보건관리자',
    '임상연구',
    '보험심사',
    '기획 / 마케팅',
    '공공기관',
    '공무원',
    '메디컬라이터',
    '영업직',
    '정신건강간호사',
    '손해사정사'
  ]

  for (const title of titles) {
    await prisma.job.create({
      data: {
        title
      }
    })
  }
}

interface legacy_company {
  companyId: string
  companyName: string
  logoUrl: string
  companyType: string
  employee: string
  incorporation: string
  companyLocation: string
  companyWebsite: string
}

async function downloadImage(imageUrl: string, imageSaveDir: string, fileName: string) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  const imageSavePath = path.join(imageSaveDir, fileName)

  if (!fs.existsSync(imageSaveDir)) {
    fs.mkdirSync(imageSaveDir, { recursive: true })
  }

  fs.writeFile(imageSavePath, response.data, err => {
    if (err) {
      console.log(err)
    }
    console.log('Image downloaded successfully!')
  })
}

// Company 데이터 삽입
async function insertCompanyDataToNewDB() {
  const companyCsvFilePath = './data/company_db.csv'

  const all_company_data: legacy_company[] = await readCSVFile(companyCsvFilePath)

  const imageType = 'company'
  const imageSaveDir = path.join(imageDirPath, imageType)

  for (const data of all_company_data.slice(1)) {
    const company: Company = {
      companyId: parseInt(data.companyId),
      companyName: data.companyName,
      logoUrl: data.logoUrl === '' ? null : `${imageSaveDir}/${data.companyId}.png`,
      companyType: data.companyType,
      employee: data.employee === '' ? null : parseInt(data.employee),
      incorporation: data.incorporation === '' ? null : new Date(data.incorporation),
      companyLocation: data.companyLocation,
      companyWebsite: data.companyWebsite === '' ? null : data.companyWebsite
    }

    if (company.logoUrl) {
      await downloadImage(data.logoUrl, imageSaveDir, `${company.companyId}.png`)
    }

    await prisma.company.create({
      data: {
        ...company
      }
    })
  }
}

async function main() {
  // await createDefaultJobs()
  await insertCompanyAndJobNoticeDataToNewDB()
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
