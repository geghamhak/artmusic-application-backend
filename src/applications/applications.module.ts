import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ParticipantsModule } from '../participants/participants.module';
import { ParticipantRecordingsModule } from '../participant-recordings/participant-recordings.module';
import { ParticipantDocumentsModule } from '../participant-documents/participant-documents.module';
import { ScoringSystemModule } from '../scoring-system/scoring-system.module';
import { ParticipantVideoLinksModule } from '../participant-video-links/participant-video-links.module';
import { ApplicationScoreModule } from '../application-score/application-score.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FestivalsModule } from '../festivals/festivals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    ParticipantsModule,
    ParticipantVideoLinksModule,
    ParticipantRecordingsModule,
    ParticipantDocumentsModule,
    ScoringSystemModule,
    ApplicationScoreModule,
    NestjsFormDataModule,
    FestivalsModule,
  ],
  exports: [TypeOrmModule, ApplicationsService],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
