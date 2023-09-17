import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { join } from 'path'
import { SeedStorage } from './seed-storage'
import { legacy_company, legacy_position } from './type'
import {
  checkSequenceUpdated,
  downloadImage,
  ensureDirectoryExists,
  getAllFilesInDirectory,
  imageDirPath,
  readCSVFile,
  readImageFileAsBuffer,
  removeFolder,
  transformPathPattern,
  updateCompanyAndJobNoticeIdSequence
} from './utils'

const prisma = new PrismaClient()
const seedStorage = new SeedStorage()

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

  console.log('Finish createDefaultJobs')
}

/** Company 데이터 삽입 */
async function insertCompanyDataToNewDB() {
  const companyCsvFilePath = './data/company_db.csv'

  const all_company_data: legacy_company[] = await readCSVFile(companyCsvFilePath)

  const imageType = 'company'
  const imageSaveDir = join(imageDirPath, imageType)

  ensureDirectoryExists(imageSaveDir)

  for (const data of all_company_data.slice(1)) {
    const companyId = parseInt(data.companyId)
    const logoImagePath = data.logoUrl === '' ? null : join(imageSaveDir, `${companyId}.png`)
    const logoImageRelativePath = data.logoUrl === '' ? null : join(imageType, `${companyId}.png`)

    if (logoImagePath) {
      await downloadImage(data.logoUrl, logoImagePath)
    }

    const company = {
      companyId,
      companyName: data.companyName,
      logoUrl: logoImageRelativePath,
      companyType: data.companyType,
      employee: data.employee === '' ? null : parseInt(data.employee),
      incorporation: data.incorporation === '' ? null : new Date(data.incorporation),
      companyLocation: data.companyLocation,
      companyWebsite: data.companyWebsite === '' ? null : data.companyWebsite
    }

    try {
      await prisma.company.create({
        data: {
          ...company
        }
      })
    } catch (error) {
      console.error('---------------------------------')
      console.error('--------- Company Error ---------')
      console.error('---------------------------------')
      console.error(error)
    }
  }

  console.log('Finish insertCompanyDataToNewDB')
}

/** Job Notice 데이터 삽입 */
async function insertJobNoticeDataToNewDB() {
  const positionCsvFilePath = './data/position_db.csv'

  const all_position_data: legacy_position[] = await readCSVFile(positionCsvFilePath)

  const titleImageType = 'job-notice/title'
  const detailImageType = 'job-notice/detail'
  const titleImageSaveDir = join(imageDirPath, titleImageType)
  const detailImageSaveDir = join(imageDirPath, detailImageType)

  ensureDirectoryExists(titleImageSaveDir)
  ensureDirectoryExists(detailImageSaveDir)

  for (const data of all_position_data.slice(1)) {
    const jobId = parseInt(data.jobId)
    const titleImagePath = data.titleImageUrl === '' ? null : join(titleImageSaveDir, `${jobId}.png`)
    const detailsImagePath = data.detailsImageUrl === '' ? null : join(detailImageSaveDir, `${jobId}.png`)
    const titleImageRelativePath = data.titleImageUrl === '' ? null : join(titleImageType, `${jobId}.png`)
    const detailsImageRelativePath = data.detailsImageUrl === '' ? null : join(detailImageType, `${jobId}.png`)

    if (titleImagePath) {
      await downloadImage(data.titleImageUrl, titleImagePath)
    }

    if (detailsImagePath) {
      await downloadImage(data.detailsImageUrl, detailsImagePath)
    }

    const position = {
      jobNoticeId: parseInt(data.jobId),
      companyId: parseInt(data.companyId),
      title: data.title,
      titleImageUrl: titleImageRelativePath,
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
      detailsImageUrl: detailsImageRelativePath,
      jobWebsite: data.jobWebsite,
      hits: parseInt(data.hits),
      createdAt: new Date(data.createdAt),
      modifiedAt: data.modifiedAt === '' ? null : new Date(data.modifiedAt)
    }

    try {
      await prisma.jobNotice.create({
        data: {
          ...position
        }
      })
    } catch (error) {
      console.error('---------------------------------')
      console.error('--------- Company Error ---------')
      console.error('---------------------------------')
      console.error(error)
    }
  }

  console.log('Finish insertJobNoticeDataToNewDB')
}

/** 특정 이미지 파일 gcp 버킷에 저장 */
async function uploadImageToStorageBucket(url: string, path: string): Promise<void> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  })
  const contentType = 'image/png'
  const metadata = [{ imageId: transformPathPattern(path) }]

  await seedStorage.save(path, contentType, Buffer.from(response.data), metadata)
}

/** 모든 이미지 파일들 gcp 버킷에 저장 */
async function uploadAllImagesToStorageBucket(): Promise<void> {
  const paths = getAllFilesInDirectory(imageDirPath)
  const contentType = 'image/png'

  await Promise.all(
    paths.map(async path => {
      const media = await readImageFileAsBuffer(join(imageDirPath, path))
      const metadata = [{ imageId: transformPathPattern(path) }]

      await seedStorage.save(path, contentType, media, metadata)
    })
  )

  console.log('Finish uploadImagesToStorageBucket')
}

async function databaseMigrationAnduploadImagesToGCP() {
  /** db 데이터 삽입 & 이미지들 다운로드 */
  await createDefaultJobs()
  await insertCompanyDataToNewDB()
  await insertJobNoticeDataToNewDB()

  /** autoincrement 업데이트 & 확인 */
  await updateCompanyAndJobNoticeIdSequence()
  await checkSequenceUpdated()

  /** 스토리지에 이미지 업로드 & 다운로드한 이미지들 삭제 */
  await uploadAllImagesToStorageBucket()
  await removeFolder(imageDirPath)
}

databaseMigrationAnduploadImagesToGCP()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
