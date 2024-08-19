import { Module } from '@nestjs/common';
import { SubNominationsService } from './sub-nominations.service';
import { SubNominationsController } from './sub-nominations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubNomination } from './entities/sub-nomination.entity';
import { TranslationsService } from '../translations/translations.service';
import { Language } from '../translations/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubNomination, Language])],
  exports: [TypeOrmModule],
  controllers: [SubNominationsController],
  providers: [SubNominationsService, TranslationsService],
})
export class SubNominationsModule {}
