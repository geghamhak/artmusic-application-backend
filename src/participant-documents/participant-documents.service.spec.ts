import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantDocumentsService } from './participant-documents.service';

describe('ParticipantDocumentsService', () => {
  let service: ParticipantDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantDocumentsService],
    }).compile();

    service = module.get<ParticipantDocumentsService>(ParticipantDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
