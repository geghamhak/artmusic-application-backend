import { Module } from '@nestjs/common';
import { JuriesService } from './juries.service';
import { JuriesController } from './juries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsModule } from '../translations/translations.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DmsModule } from '../dms/dms.module';
import { Jury } from './entities/jury.entity';

@Module({
  controllers: [JuriesController],
  imports: [
    TypeOrmModule.forFeature([Jury]),
    TranslationsModule,
    NestjsFormDataModule,
    DmsModule,
  ],
  exports: [TypeOrmModule, JuriesService],
  providers: [JuriesService],
})
export class JuriesModule {}
