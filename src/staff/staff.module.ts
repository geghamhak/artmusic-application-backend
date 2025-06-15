import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { TranslationsModule } from '../translations/translations.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DmsModule } from '../dms/dms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    TranslationsModule,
    NestjsFormDataModule,
    DmsModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [TypeOrmModule, StaffService],
})
export class StaffModule {}
