import { Module } from '@nestjs/common';
import { SubNominationsService } from './sub-nominations.service';
import { SubNominationsController } from './sub-nominations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubNomination } from './entities/sub-nomination.entity';
import { Language } from '../translations/entities/language.entity';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubNomination, Language]),
    TranslationsModule,
  ],
  exports: [TypeOrmModule, SubNominationsService],
  controllers: [SubNominationsController],
  providers: [SubNominationsService],
})
export class SubNominationsModule {}
