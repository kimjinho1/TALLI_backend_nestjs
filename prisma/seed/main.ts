import { BadRequestException } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { SeedStorage } from './seed-storage'
import { legacy_company, legacy_position } from './type'
import {
  ensureDirectoryExists,
  getAllFilesInDirectory,
  imageDirPath,
  readCSVFile,
  readImageFileAsBuffer,
  transformPathPattern
} from './utils'

const prisma = new PrismaClient()
const seedStorage = new SeedStorage()

/** admin 유저 생성 */
async function createDefaultAdminUser() {
  const nickname = process.env.ADMIN_NICKNAME
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!nickname || !email || !password) {
    throw new BadRequestException('어드민 유저 정보가 없습니다.')
  }

  const data = {
    nickname,
    email,
    password,
    role: 'ADMIN',
    currentJob: 'ADMIN',
    provider: 'NONE'
  }

  await prisma.user.create({
    data
  })

  console.log('Finish createDefaultAdminUser')
}

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
    const uuid = uuidv4()
    // const logoImagePath = data.logoUrl === '' ? null : join(imageSaveDir, `${uuid}.png`)
    const logoImageRelativePath = data.logoUrl === '' ? null : join(imageType, `${uuid}.png`)

    // if (logoImagePath) {
    //   await downloadImage(data.logoUrl, logoImagePath)
    // }

    // if (logoImageRelativePath) {
    //   const success = await uploadImageToStorageBucket(data.logoUrl, logoImageRelativePath)
    //   if (success === false) {
    //     continue
    //   }
    // }

    const company = {
      companyId: parseInt(data.companyId),
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
    const titleUuid = uuidv4()
    // const titleImagePath = data.titleImageUrl === '' ? null : join(titleImageSaveDir, `${titleUuid}.png`)
    const titleImageRelativePath = data.titleImageUrl === '' ? null : join(titleImageType, `${titleUuid}.png`)

    const detailsUuid = uuidv4()
    // const detailsImagePath = data.detailsImageUrl === '' ? null : join(detailImageSaveDir, `${detailsUuid}.png`)
    const detailsImageRelativePath = data.detailsImageUrl === '' ? null : join(detailImageType, `${detailsUuid}.png`)

    // if (titleImagePath) {
    //   await downloadImage(data.titleImageUrl, titleImagePath)
    // }

    // if (detailsImagePath) {
    //   await downloadImage(data.detailsImageUrl, detailsImagePath)
    // }

    // if (titleImageRelativePath) {
    //   const success = await uploadImageToStorageBucket(data.titleImageUrl, titleImageRelativePath)
    //   if (success === false) {
    //     continue
    //   }
    // }

    // if (detailsImageRelativePath) {
    //   const success = await uploadImageToStorageBucket(data.detailsImageUrl, detailsImageRelativePath)
    //   if (success === false) {
    //     continue
    //   }
    // }

    const position = {
      jobNoticeId: parseInt(data.jobId),
      bigQueryId: uuidv4(),
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
      bookmarks: 0,
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
async function uploadImageToStorageBucket(imageUrl: string, path: string): Promise<boolean> {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })
    const contentType = 'image/png'
    const metadata = [{ imageId: path }]

    await seedStorage.save(path, contentType, Buffer.from(response.data), metadata)
    return true
  } catch (error) {
    console.error(`잘못된 이미지 경로입니다. -> ${imageUrl}`)
    return false
  }
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

/** 올바른 이미지만 스토리지에 백업 */
async function saveCorrectImages() {
  const paths = getAllFilesInDirectory(imageDirPath)
  const imagePaths = paths.filter(path => {
    return path.endsWith('.jpg') || path.endsWith('.png')
  })
  const contentType = 'image/png'

  const users = await prisma.user.findMany({
    select: {
      imageUrl: true
    }
  })
  const Companies = await prisma.company.findMany({
    select: {
      logoUrl: true
    }
  })
  const JobNoticeTitles = await prisma.jobNotice.findMany({
    select: {
      titleImageUrl: true
    }
  })
  const JobNoticeDetails = await prisma.jobNotice.findMany({
    select: {
      detailsImageUrl: true
    }
  })
  const userImageUrls = users.map(user => user.imageUrl).filter(Boolean)
  const companyImageUrls = Companies.map(company => company.logoUrl).filter(Boolean)
  const jobNoticeTitlesImageUrls = JobNoticeTitles.map(jobNotice => jobNotice.titleImageUrl).filter(Boolean)
  const jobNoticeDetailsImageUrls = JobNoticeDetails.map(jobNotice => jobNotice.detailsImageUrl).filter(Boolean)

  const dbImagePaths = userImageUrls.concat(companyImageUrls, jobNoticeTitlesImageUrls, jobNoticeDetailsImageUrls)
  const dbImageCnt = dbImagePaths.length
  let uploadCnt = 0

  console.log('local image count: ', imagePaths.length)
  console.log('db image count: ', dbImageCnt)

  await Promise.all(
    imagePaths.map(async path => {
      const media = await readImageFileAsBuffer(join(imageDirPath, path))
      const metadata = [{ imageId: transformPathPattern(path) }]
      if (dbImagePaths.includes(path)) {
        uploadCnt += 1
        await seedStorage.save(path, contentType, media, metadata)
      }
    })
  )
  console.log('upload image count: ', uploadCnt)
  console.log('Finish saveCorrectImages')
}

async function databaseMigrationAnduploadImagesToGCP() {
  /** db 데이터 삽입 & 이미지들 다운로드 */
  await createDefaultAdminUser()
  await createDefaultJobs()
  await insertCompanyDataToNewDB()
  // await insertJobNoticeDataToNewDB()

  /** autoincrement 업데이트 & 확인 */
  // await updateCompanyAndJobNoticeIdSequence()
  // await checkSequenceUpdated()

  /** 스토리지에 이미지 업로드 & 다운로드한 이미지들 삭제 */
  // await uploadAllImagesToStorageBucket()
  // await removeFolder(imageDirPath)
}

databaseMigrationAnduploadImagesToGCP()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
