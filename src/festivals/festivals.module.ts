import { forwardRef, Module } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from './entities/festival.entity';
import { TranslationsModule } from '../translations/translations.module';
import { FestivalTypesModule } from '../festival-types/festival-types.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DmsModule } from 'src/dms/dms.module';
import { FestivalImagesModule } from '../festival-images/festival-images.module';
import { ExcelModule } from '../excel/excel.module';
import { FestivalConfigModule } from '../festival-config/festival-config.module';
import { FestivalQueriesService } from './festival.queries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Festival]),
    TranslationsModule,
    FestivalTypesModule,
    NestjsFormDataModule,
    DmsModule,
    forwardRef(() => FestivalImagesModule),
    ExcelModule,
    FestivalConfigModule,
  ],
  exports: [TypeOrmModule, FestivalsService, FestivalQueriesService],
  controllers: [FestivalsController],
  providers: [FestivalsService, FestivalQueriesService],
})
export class FestivalsModule {}
