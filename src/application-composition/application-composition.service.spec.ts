import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationCompositionService } from './application-composition.service';

describe('ApplicationCompositionService', () => {
  let service: ApplicationCompositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationCompositionService],
    }).compile();

    service = module.get<ApplicationCompositionService>(
      ApplicationCompositionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
