import { Module } from '@nestjs/common';
import { TranslationsModule } from './translations/translations.module';
import { CountriesModule } from './countries/countries.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CountriesService } from './countries/countries.service';
import { RegionsModule } from './regions/regions.module';
import { SchoolsModule } from './schools/schools.module';
import { NominationsModule } from './nominations/nominations.module';
import { SubNominationsModule } from './sub-nominations/sub-nominations.module';
import { FestivalTypesModule } from './festival-types/festival-types.module';
import { FestivalsModule } from './festivals/festivals.module';
import { ParticipantDocumentsModule } from './participant-documents/participant-documents.module';
import { ParticipantVideoLinksModule } from './participant-video-links/participant-video-links.module';
import { ParticipantRecordingsModule } from './participant-recordings/participant-recordings.module';
import { ParticipantsModule } from './participants/participants.module';
import { ApplicationsModule } from './applications/applications.module';
import { ParticipantTypesModule } from './participant-types/participant-types.module';
import { ScoringSystemModule } from './scoring-system/scoring-system.module';
import { ParticipantVideoLinksService } from './participant-video-links/participant-video-links.service';
import { ParticipantsService } from './participants/participants.service';
import { ParticipantRecordingsService } from './participant-recordings/participant-recordings.service';
import { ParticipantDocumentsService } from './participant-documents/participant-documents.service';
import { ScoringSystemService } from './scoring-system/scoring-system.service';
import { Application } from './applications/entities/application.entity';
import { Country } from './countries/entities/country.entity';
import { FestivalType } from './festival-types/entities/festival-type.entity';
import { Nomination } from './nominations/entities/nomination.entity';
import { Festival } from './festivals/entities/festival.entity';
import { ParticipantDocument } from './participant-documents/entities/participant-document.entity';
import { ParticipantRecording } from './participant-recordings/entities/participant-recording.entity';
import { ParticipantType } from './participant-types/entities/participant-type.entity';
import { ParticipantVideoLink } from './participant-video-links/entities/participant-video-link.entity';
import { Participant } from './participants/entities/participant.entity';
import { Region } from './regions/entities/region.entity';
import { School } from './schools/entities/school.entity';
import { ScoringSystem } from './scoring-system/entities/scoring-system.entity';
import { SubNomination } from './sub-nominations/entities/sub-nomination.entity';
import { Translation } from './translations/entities/translation.entity';
import { Language } from './translations/entities/language.entity';
import { TextContent } from './translations/entities/textContent.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslationsService } from './translations/translations.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'mysql' as const,
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [
            Application,
            Country,
            FestivalType,
            Festival,
            Nomination,
            ParticipantDocument,
            ParticipantRecording,
            ParticipantType,
            ParticipantVideoLink,
            Participant,
            Region,
            School,
            ScoringSystem,
            SubNomination,
            Translation,
            Language,
            TextContent,
          ],
          synchronize: configService.get('DATABASE_SYNCHRONIZE'),
        }) as TypeOrmModuleOptions,
    }),
    TranslationsModule,
    CountriesModule,
    RegionsModule,
    SchoolsModule,
    NominationsModule,
    SubNominationsModule,
    FestivalTypesModule,
    FestivalsModule,
    ParticipantRecordingsModule,
    ParticipantVideoLinksModule,
    ParticipantDocumentsModule,
    ParticipantsModule,
    ApplicationsModule,
    ParticipantTypesModule,
    ScoringSystemModule,
  ],
  providers: [
    CountriesService,
    ParticipantVideoLinksService,
    ParticipantsService,
    ParticipantRecordingsService,
    ParticipantDocumentsService,
    ScoringSystemService,
    TranslationsService,
  ],
})
export class AppModule {}
