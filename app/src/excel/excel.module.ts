import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [ApplicationsModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
