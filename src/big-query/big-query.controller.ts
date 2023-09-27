import { Controller, Delete, Get, Injectable, Param } from '@nestjs/common'
import { BigQueryService } from './big-query.service'
import { PositionDto } from './dto/response'

@Injectable()
@Controller('big-query')
export class BigQueryController {
  constructor(private readonly bigQueryService: BigQueryService) {}

  @Get('position')
  async getPositions(): Promise<PositionDto[]> {
    return await this.bigQueryService.getPositions()
  }

  @Get('position/:id')
  async getPosition(@Param('id') id: string): Promise<PositionDto> {
    return await this.bigQueryService.getPosition(id)
  }

  @Delete('position/:id')
  async deletePosition(@Param('id') id: string): Promise<PositionDto> {
    return await this.bigQueryService.deletePosition(id)
  }
}
