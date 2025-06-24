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
import { ParticipantVideoLink } from './participant-video-links/entities/participant-video-link.entity';
import { Participant } from './participants/entities/participant.entity';
import { Region } from './regions/entities/region.entity';
import { School } from './schools/entities/school.entity';
import { SubNomination } from './sub-nominations/entities/sub-nomination.entity';
import { Translation } from './translations/entities/translation.entity';
import { Language } from './translations/entities/language.entity';
import { TextContent } from './translations/entities/textContent.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslationsService } from './translations/translations.service';
import { ApplicationScoreModule } from './application-score/application-score.module';
import { ApplicationScore } from './application-score/entities/application-score.entity';
import { DmsModule } from './dms/dms.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { StaffModule } from './staff/staff.module';
import { HeaderModule } from './header/header.module';
import { HomePageModule } from './home-page/home-page.module';
import { ApplicationCompositionModule } from './application-composition/application-composition.module';
import { ApplicationComposition } from './application-composition/entities/application-composition.entity';
import { ExcelModule } from './excel/excel.module';
import { Header } from './header/entities/header.entity';
import { HomePage } from './home-page/entities/home-page.entity';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/entities/contact.entity';
import { FestivalImagesModule } from './festival-images/festival-images.module';
import { StaffPageModule } from './staff-page/staff-page.module';
import { FestivalImage } from './festival-images/entities/festival-image.entity';
import { StaffPage } from './staff-page/entities/staff-page.entity';
import { Staff } from './staff/entities/staff.entity';
import { JuriesModule } from './juries/juries.module';
import { Jury } from './juries/entities/jury.entity';
import { EmailQueueModule } from './email-queue/email-queue.module';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from '@aws-sdk/client-sqs';
import { EmailQueue } from './email-queue/entities/email-queue.entity';
import { FestivalJuryModule } from './festival-jury/festival-jury.module';
import { FestivalJury } from './festival-jury/entities/festival-jury.entity';

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
            ParticipantVideoLink,
            Participant,
            Region,
            School,
            SubNomination,
            Translation,
            Language,
            TextContent,
            ApplicationScore,
            ApplicationComposition,
            Header,
            HomePage,
            Contact,
            FestivalImage,
            StaffPage,
            Staff,
            Jury,
            EmailQueue,
            FestivalJury,
          ],
          synchronize: configService.get('DATABASE_SYNCHRONIZE'),
        }) as TypeOrmModuleOptions,
    }),
    SqsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        producers: [
          {
            name: configService.get('EMAIL_QUEUE_NAME'),
            queueUrl: configService.get('EMAIL_QUEUE_URL'),
            region: configService.get('AWS_REGION'),
            terminateGracefully: true, // gracefully shutdown when SIGINT/SIGTERM is received
            sqs: new AWS.SQS({
              region: configService.get('AWS_REGION'),
              credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
              },
            }),
          },
        ],
      }),
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
    ScoringSystemModule,
    ApplicationScoreModule,
    DmsModule,
    StaffModule,
    NestjsFormDataModule,
    HeaderModule,
    HomePageModule,
    ApplicationCompositionModule,
    ExcelModule,
    ContactModule,
    StaffPageModule,
    FestivalImagesModule,
    JuriesModule,
    EmailQueueModule,
    FestivalJuryModule,
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
