import { Test, TestingModule } from '@nestjs/testing';
import { FestivalJuryService } from './festival-jury.service';

describe('FestivalJuryService', () => {
  let service: FestivalJuryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FestivalJuryService],
    }).compile();

    service = module.get<FestivalJuryService>(FestivalJuryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
