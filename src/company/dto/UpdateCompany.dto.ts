import { PartialType } from '@nestjs/swagger'
import { CreateCompanyDto } from './CreateCompany.dto'

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
