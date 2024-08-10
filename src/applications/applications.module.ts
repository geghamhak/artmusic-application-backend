import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ParticipantVideoLinksService } from '../participant-video-links/participant-video-links.service';
import { ParticipantsService } from '../participants/participants.service';
import { ParticipantRecordingsService } from '../participant-recordings/participant-recordings.service';
import { ParticipantDocumentsService } from '../participant-documents/participant-documents.service';
import { ScoringSystemService } from '../scoring-system/scoring-system.service';
import { ParticipantRecording } from '../participant-recordings/entities/participant-recording.entity';
import { ParticipantVideoLink } from '../participant-video-links/entities/participant-video-link.entity';
import { Participant } from '../participants/entities/participant.entity';
import { ParticipantDocument } from '../participant-documents/entities/participant-document.entity';
import { ScoringSystem } from '../scoring-system/entities/scoring-system.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      ParticipantVideoLink,
      Participant,
      ParticipantRecording,
      ParticipantDocument,
      ScoringSystem,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ParticipantVideoLinksService,
    ParticipantsService,
    ParticipantRecordingsService,
    ParticipantDocumentsService,
    ScoringSystemService,
  ],
})
export class ApplicationsModule {}
