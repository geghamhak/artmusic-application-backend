import { Injectable } from '@nestjs/common';
import { CreateParticipantRecordingDto } from './dto/create-participant-recording.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantRecording } from './entities/participant-recording.entity';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

@Injectable()
export class ParticipantRecordingsService {
  constructor(
    @InjectRepository(ParticipantRecording)
    private participantRecordingRepository: Repository<ParticipantRecording>,
  ) {}
  async create(
    uploadedAudioFiles: FileSystemStoredFile[],
  ): Promise<ParticipantRecording[]> {
    try {
      const recordings: ParticipantRecording[] = [];
      uploadedAudioFiles.map(async (uploadedAudioFile) => {
        const recording = new ParticipantRecording();
        recording.originalName = uploadedAudioFile.originalName;
        recording.originalMimeType = uploadedAudioFile.mimetype;

        await this.participantRecordingRepository.save(recording);
        recordings.push(recording);
        // add to AWS S3
      });
      return recordings;
    } catch (error) {
      throw new Error('Unavailable participant recording');
    }
  }
}
