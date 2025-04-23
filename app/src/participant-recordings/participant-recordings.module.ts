import { Module } from '@nestjs/common';
import { ParticipantRecordingsService } from './participant-recordings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRecording } from './entities/participant-recording.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantRecording])],
  exports: [TypeOrmModule, ParticipantRecordingsService],
  providers: [ParticipantRecordingsService],
})
export class ParticipantRecordingsModule {}
