import { Test, TestingModule } from '@nestjs/testing';
import { FestivalJuryController } from './festival-jury.controller';
import { FestivalJuryService } from './festival-jury.service';

describe('FestivalJuryController', () => {
  let controller: FestivalJuryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalJuryController],
      providers: [FestivalJuryService],
    }).compile();

    controller = module.get<FestivalJuryController>(FestivalJuryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
