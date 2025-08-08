import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { TranslationsModule } from '../translations/translations.module';
import { ParticipantQueryService } from './participant-query-service';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), TranslationsModule],
  providers: [ParticipantsService, ParticipantQueryService],
  exports: [TypeOrmModule, ParticipantsService, ParticipantQueryService],
})
export class ParticipantsModule {}
