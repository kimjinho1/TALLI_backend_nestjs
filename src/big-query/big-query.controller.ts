import { Controller, Delete, Get, Injectable, Param } from '@nestjs/common'
import { BigQueryService } from './big-query.service'

@Injectable()
@Controller('big-query')
export class BigQueryController {
  constructor(private readonly bigQueryService: BigQueryService) {}

  @Get('position')
  async getPositions(): Promise<any[]> {
    return await this.bigQueryService.getPositions()
  }

  @Get('position/:id')
  async getPosition(@Param('id') id: string): Promise<any[]> {
    return await this.bigQueryService.getPosition(id)
  }

  @Delete('position/:id')
  async deletePosition(@Param('id') id: string): Promise<any[]> {
    return await this.bigQueryService.deletePosition(id)
  }
}
