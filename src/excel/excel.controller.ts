import { Controller, Get, Param, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { Response } from 'express';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('applications/:festivalId')
  async exportApplications(@Res() res: Response, @Param() festivalId: number) {
    return res
      .set('Content-Disposition', `attachment; filename=example.xlsx`)
      .send(await this.excelService.exportApplications(festivalId))
      .end();
  }
}
