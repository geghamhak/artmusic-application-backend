import { Test, TestingModule } from '@nestjs/testing';
import { FestivalTypesController } from './festival-types.controller';
import { FestivalTypesService } from './festival-types.service';

describe('FestivalTypesController', () => {
  let controller: FestivalTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalTypesController],
      providers: [FestivalTypesService],
    }).compile();

    controller = module.get<FestivalTypesController>(FestivalTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
