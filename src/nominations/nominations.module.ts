import { Module } from '@nestjs/common';
import { NominationsService } from './nominations.service';
import { NominationsController } from './nominations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nomination } from './entities/nomination.entity';
import { TranslationsService } from '../translations/translations.service';
import { Language } from '../translations/entities/language.entity';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nomination, Language]),
    TranslationsModule,
  ],
  exports: [TypeOrmModule, NominationsService],
  controllers: [NominationsController],
  providers: [NominationsService],
})
export class NominationsModule {}
