import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantRecordingsService } from './participant-recordings.service';

describe('RecordingsService', () => {
  let service: ParticipantRecordingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantRecordingsService],
    }).compile();

    service = module.get<ParticipantRecordingsService>(
      ParticipantRecordingsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
