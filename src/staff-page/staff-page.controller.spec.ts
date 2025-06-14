import { Test, TestingModule } from '@nestjs/testing';
import { StaffPageController } from './staff-page.controller';
import { StaffPageService } from './staff-page.service';

describe('StaffPageController', () => {
  let controller: StaffPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffPageController],
      providers: [StaffPageService],
    }).compile();

    controller = module.get<StaffPageController>(StaffPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
