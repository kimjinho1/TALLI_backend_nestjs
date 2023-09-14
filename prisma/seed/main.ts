import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { downloadImage, readCSVFile, test, updateCompanyAndJobNoticeIdSequence } from './utils'
import { legacy_company, legacy_position } from './type'

const prisma = new PrismaClient()
const imageDirPath = path.join(process.cwd(), 'images')

/** 유저 직군 데이터 삽입 */
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

/** Company 데이터 삽입 */
async function insertCompanyDataToNewDB() {
  const companyCsvFilePath = './data/company_db.csv'

  const all_company_data: legacy_company[] = await readCSVFile(companyCsvFilePath)

  const imageType = 'company'
  const imageSaveDir = path.join(imageDirPath, imageType)

  if (!fs.existsSync(imageSaveDir)) {
    fs.mkdirSync(imageSaveDir, { recursive: true })
  }

  for (const data of all_company_data.slice(1)) {
    const company = {
      companyId: parseInt(data.companyId),
      companyName: data.companyName,
      logoUrl: data.logoUrl === '' ? null : path.join(imageSaveDir, `${data.companyId}.png`),
      companyType: data.companyType,
      employee: data.employee === '' ? null : parseInt(data.employee),
      incorporation: data.incorporation === '' ? null : new Date(data.incorporation),
      companyLocation: data.companyLocation,
      companyWebsite: data.companyWebsite === '' ? null : data.companyWebsite
    }

    if (company.logoUrl) {
      await downloadImage(data.logoUrl, company.logoUrl)
    }

    try {
      await prisma.company.create({
        data: {
          ...company
        }
      })
    } catch (error) {
      console.error(error)
      console.error(company)
    }
  }
}

/** Job Notice 데이터 삽입 */
async function insertJobNoticeDataToNewDB() {
  const positionCsvFilePath = './data/position_db.csv'

  const all_position_data: legacy_position[] = await readCSVFile(positionCsvFilePath)

  const titleImageType = 'job-notice/title'
  const detailImageType = 'job-notice/detail'
  const titleImageSaveDir = path.join(imageDirPath, titleImageType)
  const detailImageSaveDir = path.join(imageDirPath, detailImageType)

  // 함수로 만들기
  if (!fs.existsSync(titleImageSaveDir)) {
    fs.mkdirSync(titleImageSaveDir, { recursive: true })
  }
  if (!fs.existsSync(detailImageSaveDir)) {
    fs.mkdirSync(detailImageSaveDir, { recursive: true })
  }

  for (const data of all_position_data.slice(1)) {
    const position = {
      jobNoticeId: parseInt(data.jobId),
      companyId: parseInt(data.companyId),
      title: data.title,
      titleImageUrl: data.titleImageUrl === '' ? null : path.join(titleImageSaveDir, `${data.jobId}.png`),
      category: data.category,
      deadline: data.deadline === '' ? null : new Date(data.deadline),
      experience: data.experience,
      education: data.education,
      requirements: data.requirements === '' ? null : data.requirements,
      preferences: data.preferences === '' ? null : data.preferences,
      salary: data.salary === '' ? null : data.salary,
      jobType: data.jobType,
      jobLocation: data.jobLocation,
      details: data.details === '' ? null : data.details,
      detailsImageUrl: data.detailsImageUrl === '' ? null : path.join(detailImageSaveDir, `${data.jobId}.png`),
      jobWebsite: data.jobWebsite,
      hits: parseInt(data.hits),
      createdAt: new Date(data.createdAt),
      modifiedAt: data.modifiedAt === '' ? null : new Date(data.modifiedAt)
    }

    if (position.titleImageUrl) {
      await downloadImage(data.titleImageUrl, position.titleImageUrl)
    }

    if (position.detailsImageUrl) {
      await downloadImage(data.detailsImageUrl, position.detailsImageUrl)
    }

    try {
      await prisma.jobNotice.create({
        data: {
          ...position
        }
      })
    } catch (error) {
      console.error(error)
      console.error(position)
    }
  }
}

async function main() {
  await createDefaultJobs()
  await insertCompanyDataToNewDB()
  await updateCompanyAndJobNoticeIdSequence()
  await test()
  await insertJobNoticeDataToNewDB()
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
