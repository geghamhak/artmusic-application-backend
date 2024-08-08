import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantTypesService } from './participant-types.service';

describe('ParticipantTypesService', () => {
  let service: ParticipantTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantTypesService],
    }).compile();

    service = module.get<ParticipantTypesService>(ParticipantTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
