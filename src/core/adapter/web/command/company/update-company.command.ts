import { PartialType } from '@nestjs/mapped-types'
import { CreateCompanyCommand } from './create-company.command'

export class UpdateCompanyCommand extends PartialType(CreateCompanyCommand) {}
