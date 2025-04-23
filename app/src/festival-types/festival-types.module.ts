import { Module } from '@nestjs/common';
import { FestivalTypesService } from './festival-types.service';
import { FestivalTypesController } from './festival-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalType } from './entities/festival-type.entity';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalType]), TranslationsModule],
  exports: [TypeOrmModule, FestivalTypesService],
  controllers: [FestivalTypesController],
  providers: [FestivalTypesService],
})
export class FestivalTypesModule {}
