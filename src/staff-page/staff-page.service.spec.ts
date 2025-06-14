import { Test, TestingModule } from '@nestjs/testing';
import { StaffPageService } from './staff-page.service';

describe('StaffPageService', () => {
  let service: StaffPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffPageService],
    }).compile();

    service = module.get<StaffPageService>(StaffPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
