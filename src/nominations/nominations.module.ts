import { Module } from '@nestjs/common';
import { NominationsService } from './nominations.service';
import { NominationsController } from './nominations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nomination } from './entities/nomination.entity';
import { TranslationsService } from '../translations/translations.service';
import { Language } from '../translations/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nomination, Language])],
  exports: [TypeOrmModule],
  controllers: [NominationsController],
  providers: [NominationsService, TranslationsService],
})
export class NominationsModule {}
