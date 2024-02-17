import { Injectable, NotFoundException } from '@nestjs/common'
import { ErrorMessages } from '../exception/error.messages'

export const jobs = [
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

@Injectable()
export class JobMapperService {
  private jobMap: Map<number, string> = new Map<number, string>()

  constructor() {
    jobs.forEach((job, idx) => this.jobMap.set(idx, job))
  }

  /** 직업 이름으로 직업 ID를 가져오는 로직 */
  getJobId(job: string): number {
    const jobId = Array.from(this.jobMap.keys()).find(key => this.jobMap.get(key) === job)
    if (jobId !== 0 && !jobId) {
      throw new NotFoundException(ErrorMessages.JOB_NOT_FOUND)
    }
    return jobId
  }

  /** 직업 이름 배열로 직업 ID 배열을 가져오는 로직 */
  getJobIds(jobs: string[]): number[] {
    const jobIds = jobs.map(job => this.getJobId(job))
    return jobIds
  }

  /** 직업 ID로 직업 이름을 가져오는 로직 */
  getJobName(id: number): string {
    const job = this.jobMap.get(id)
    if (!job) {
      throw new NotFoundException(ErrorMessages.JOB_ID_NOT_FOUND)
    }
    return job
  }

  /** 직업 ID 배열로 직업 이름 배열을 가져오는 로직 */
  getJobNames(ids: number[]): string[] {
    const jobs = ids.map(id => this.getJobName(id))
    return jobs
  }
}
