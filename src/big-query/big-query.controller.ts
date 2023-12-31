import { Controller, Delete, Get, Injectable, Param, UseGuards } from '@nestjs/common'
import { BigQueryService } from './big-query.service'
import { PositionDto } from './dto/response'
import { Roles } from 'src/auth/role/roles.decorator'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/auth/role/role.guard'

@Injectable()
@Controller('big-query')
export class BigQueryController {
  constructor(private readonly bigQueryService: BigQueryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('position')
  async getPositions(): Promise<PositionDto[]> {
    return await this.bigQueryService.getPositions()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('position/:id')
  async getPosition(@Param('id') id: string): Promise<PositionDto> {
    return await this.bigQueryService.getPosition(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('position/:id')
  async deletePosition(@Param('id') id: string): Promise<PositionDto> {
    return await this.bigQueryService.deletePosition(id)
  }
}
