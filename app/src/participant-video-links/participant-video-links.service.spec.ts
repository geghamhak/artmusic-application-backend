import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantVideoLinksService } from './participant-video-links.service';

describe('ParticipantVideoLinksService', () => {
  let service: ParticipantVideoLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantVideoLinksService],
    }).compile();

    service = module.get<ParticipantVideoLinksService>(
      ParticipantVideoLinksService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
