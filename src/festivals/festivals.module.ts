import { Module } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from './entities/festival.entity';
import { TranslationsModule } from '../translations/translations.module';
import { FestivalTypesModule } from '../festival-types/festival-types.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([Festival]),
    TranslationsModule,
    FestivalTypesModule,
    NestjsFormDataModule,
  ],
  exports: [TypeOrmModule, FestivalsService],
  controllers: [FestivalsController],
  providers: [FestivalsService],
})
export class FestivalsModule {}
