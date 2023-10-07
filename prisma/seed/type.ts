export interface legacy_company {
  companyId: string
  companyName: string
  logoUrl: string
  companyType: string
  employee: string
  incorporation: string
  companyLocation: string
  companyWebsite: string
}

export interface legacy_position {
  jobId: string
  companyId: string
  title: string
  titleImageUrl: string
  category: string
  deadline: string
  experience: string
  education: string
  requirements: string
  preferences: string
  salary: string
  jobType: string
  jobLocation: string
  details: string
  detailsImageUrl: string
  jobWebsite: string
  hits: string
  createdAt: string
  modifiedAt: string
}
