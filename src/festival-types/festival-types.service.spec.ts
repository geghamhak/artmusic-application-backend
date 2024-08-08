import { Test, TestingModule } from '@nestjs/testing';
import { FestivalTypesService } from './festival-types.service';

describe('FestivalTypesService', () => {
  let service: FestivalTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FestivalTypesService],
    }).compile();

    service = module.get<FestivalTypesService>(FestivalTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
