import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationScoreService } from './application-score.service';

describe('ApplicationScoreService', () => {
  let service: ApplicationScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationScoreService],
    }).compile();

    service = module.get<ApplicationScoreService>(ApplicationScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
