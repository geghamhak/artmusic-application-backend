import { Test, TestingModule } from '@nestjs/testing';
import { ScoringSystemService } from './scoring-system.service';

describe('ScoringSystemService', () => {
  let service: ScoringSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoringSystemService],
    }).compile();

    service = module.get<ScoringSystemService>(ScoringSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
