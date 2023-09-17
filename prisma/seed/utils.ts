import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import * as csv from 'csv-parser'
import { createReadStream, existsSync, mkdirSync, readFile, readdirSync, statSync } from 'fs'
import { rm, writeFile } from 'fs/promises'
import { join, relative } from 'path'
import { promisify } from 'util'

const prisma = new PrismaClient()
export const imageDirPath = join(process.cwd(), 'images')

/** Load csv file */
export function readCSVFile(filePath: string): Promise<any[]> {
  const results: any[] = []

  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath).on('error', error => reject(error))

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

/** 폴더가 없으면 생성 */
export function ensureDirectoryExists(directoryPath: string): void {
  try {
    if (!existsSync(directoryPath)) {
      mkdirSync(directoryPath, { recursive: true })
    }
  } catch (error) {
    throw new Error(`폴더 생성 실패: ${error}`)
  }
}

/** 폴더 삭제 */
export async function removeFolder(folderPath: string): Promise<void> {
  try {
    await rm(folderPath, { recursive: true })
  } catch (error) {
    throw new Error(`폴더 삭제 실패: ${error}`)
  }
}

/** Download image by image url */
export async function downloadImage(imageUrl: string, imageSavePath: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    await writeFile(imageSavePath, response.data)
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
  await prisma.$executeRaw`SELECT setval(
  pg_get_serial_sequence('"Company"', 'company_id'),
  coalesce(max(company_id) + 1, 1),
  false
) FROM "Company"`

  await prisma.$executeRaw`SELECT setval(
  pg_get_serial_sequence('"JobNotice"', 'job_notice_id'),
  coalesce(max(job_notice_id) + 1, 1),
  false
) FROM "JobNotice"`

  console.log('Update company_id and job_notice_id sequence')
}

/** autoincrement가 업데이트 되었는지 확인 */
export async function checkSequenceUpdated() {
  const testCompanyData = {
    companyName: 'test1234',
    logoUrl: 'images/company/test1234.png',
    companyType: '대학병원',
    employee: 6333,
    incorporation: new Date('1998-01-15T00:00:00.000Z'),
    companyLocation: '서울 종로구 대학로 102',
    companyWebsite: 'http://www.snuh.com'
  }

  const testJobNoticeData = {
    companyId: 4,
    title: '1231231[경력] CO팀 CRA 채용 (서울본사)',
    titleImageUrl: null,
    category: '임상연구',
    deadline: null,
    experience: '경력',
    education: '대졸 이상 (4년제)',
    requirements:
      '• 의학, 간호학, 약학, 생물학 등 임상시험 관련학과 졸업자\n' +
      '• 임상시험 CRA 경력 1년 이상자\n' +
      '• Oncology Study 경험자',
    preferences: '• 임상시험 관련 규정에 대한 이해도가 있는 분(ICH/GCP, FDA 가이드라인 등)\n• 영어활용 우수자',
    salary: '개별연봉제(면접 후 협의)',
    jobType: '정규직(면접 시 평가에 따라 수습기간 적용가능성 有)',
    jobLocation: '서울 강남구',
    details:
      '■ 담당업무\n' +
      '- IIT&SIT Management\n' +
      '- Site Management & Monitoring\n' +
      '- IRB related Activity\n' +
      '- Essential document management\n' +
      '- Study Set up\n' +
      '- Site contract\n' +
      "- Investigator's fee management\n" +
      '- Other study related operation tasks\n' +
      '\n' +
      '■ 근무조건\n' +
      '- 고용형태 : 정규직(면접 시 평가에 따라 수습기간 적용가능성 有)\n' +
      '- 근무일시 : 주5일(월~금), 시차출퇴근제(Core time 오전 10시~오후 5시)\n' +
      '- 소속 : CO팀\n' +
      '- 급여 : 개별연봉제(면접 후 협의)\n' +
      '- 재택근무 : 근속 3개월 후 재택근무 가능\n' +
      '- 근무지역 : 서울특별시 강남구 역삼로 412, 씨엔알빌딩(2호선 선릉역, 지하주차장 무료)\n' +
      '\n' +
      '■ 지원방법\n' +
      '- 홈페이지 지원, 이메일 지원\n' +
      '- 이메일 : recruit@cnrres.com\n' +
      '- 홈페이지 : www.cnrres.com > Careers\n' +
      '- 채용문의 : 이메일로 문의\n' +
      '- 이메일 지원 시 CV양식 자유',
    detailsImageUrl: null,
    jobWebsite: 'http://www.cnrres.com/careers/careers-list/?mod=document&pageid=1&keyword=CRA&uid=72',
    hits: 110,
    createdAt: '2000-02-04T07:00:00.000Z',
    modifiedAt: null
  }

  const createdCompany = await prisma.company.create({
    data: testCompanyData
  })

  const createdJobNotice = await prisma.jobNotice.create({
    data: testJobNoticeData
  })

  console.log('Success sequence update check')

  await prisma.company.delete({
    where: {
      companyId: createdCompany.companyId
    }
  })

  await prisma.jobNotice.delete({
    where: {
      jobNoticeId: createdJobNotice.jobNoticeId
    }
  })

  console.log('Roll back test data')
}

/** 파일 경로를 이름, 숫자 순으로 정렬 */
export function sortFilePathsByNameAndNumber(filePaths: string[]): string[] {
  filePaths.sort((a, b) => {
    // "/" 앞의 이름으로 정렬
    const nameA = a.split('/')[0]
    const nameB = b.split('/')[0]
    const nameComparison = nameA.localeCompare(nameB)

    if (nameComparison !== 0) {
      return nameComparison
    }

    // ".png" 앞의 숫자로 정렬
    const numberA = parseInt(a.match(/(\d+)/)?.[0] || '0', 10)
    const numberB = parseInt(b.match(/(\d+)/)?.[0] || '0', 10)

    return numberA - numberB
  })

  return filePaths
}

/** 문자열 format 수정(company/1.png -> company_1) */
export function transformPathPattern(path: string): string {
  return path
    .replace(/\//g, '_') // '/'를 '_'로 대체
    .replace(/(\d+)\//g, '$1_') // 숫자와 '/' 사이에 '_' 삽입
    .replace(/\.[^.]+$/, '') // 확장자 제거
}

/** 이미지 파일을 Buffer로 읽는 함수 */
export async function readImageFileAsBuffer(filePath: string): Promise<Buffer> {
  const readFileAsync = promisify(readFile)
  try {
    const buffer = await readFileAsync(filePath)
    return Buffer.from(buffer)
  } catch (error) {
    throw new Error(`Failed to read image file: ${error}`)
  }
}

/** 특정 경로에 포함된 모든 파일의 경로를 반환  */
export function getAllFilesInDirectory(directoryPath: string): string[] {
  const filePaths: string[] = []

  function traverseDirectory(currentPath: string) {
    const files = readdirSync(currentPath)

    for (const file of files) {
      const filePath = join(currentPath, file)
      const stats = statSync(filePath)

      if (stats.isDirectory()) {
        traverseDirectory(filePath) // 재귀적으로 폴더 내의 파일 검색
      } else {
        const relativePath = relative(directoryPath, filePath)
        filePaths.push(relativePath) // 파일 경로를 배열에 추가
      }
    }
  }

  traverseDirectory(directoryPath)

  const sortedFilePaths = sortFilePathsByNameAndNumber(filePaths)

  return sortedFilePaths
}
