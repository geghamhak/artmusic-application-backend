import { Injectable } from '@nestjs/common';
import { CreateParticipantRecordingDto } from './dto/create-participant-recording.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantRecording } from './entities/participant-recording.entity';

@Injectable()
export class ParticipantRecordingsService {
  constructor(
    @InjectRepository(ParticipantRecording)
    private participantRecordingRepository: Repository<ParticipantRecording>,
  ) {}
  create(createParticipantRecordingDtos: CreateParticipantRecordingDto[]) {
    try {
      const recordings = [];
      createParticipantRecordingDtos.map((createParticipantRecordingDto) => {
        const recording = this.participantRecordingRepository.create();
        // add to AWS S3
        console.log(createParticipantRecordingDto);
        recordings.push(recording);
      });

      return recordings;
    } catch (error) {
      throw new Error('Unavailable participant recording');
    }
  }
}
