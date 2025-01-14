import { Injectable } from '@nestjs/common';
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
  async saveMany(
    uploadedAudioFiles: FileSystemStoredFile[],
  ): Promise<ParticipantRecording[]> {
    try {
      const recordings = uploadedAudioFiles.map((uploadedAudioFile) => {
        return this.create(uploadedAudioFile);
      });
      return await Promise.all(recordings);
    } catch (error) {
      throw new Error('Unavailable participant recording');
    }
  }

  async create(
    uploadedAudioFile: FileSystemStoredFile,
  ): Promise<ParticipantRecording> {
    const recording = new ParticipantRecording();
    recording.originalName = uploadedAudioFile.originalName;
    recording.originalMimeType = uploadedAudioFile.mimetype;

    return this.participantRecordingRepository.save(recording);
  }
}
