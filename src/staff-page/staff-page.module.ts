import { Module } from '@nestjs/common';
import { StaffPageService } from './staff-page.service';
import { StaffPageController } from './staff-page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsModule } from '../translations/translations.module';
import { StaffPage } from './entities/staff-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffPage]), TranslationsModule],
  exports: [TypeOrmModule, StaffPageService],
  controllers: [StaffPageController],
  providers: [StaffPageService],
})
export class StaffPageModule {}
