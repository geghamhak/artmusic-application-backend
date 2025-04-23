import { Test, TestingModule } from '@nestjs/testing';
import { SubNominationsService } from './sub-nominations.service';

describe('SubNominationsService', () => {
  let service: SubNominationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubNominationsService],
    }).compile();

    service = module.get<SubNominationsService>(SubNominationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
