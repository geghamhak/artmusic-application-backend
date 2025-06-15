import { Test, TestingModule } from '@nestjs/testing';
import { JuriesController } from './juries.controller';
import { JuriesService } from './juries.service';

describe('JuriesController', () => {
  let controller: JuriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JuriesController],
      providers: [JuriesService],
    }).compile();

    controller = module.get<JuriesController>(JuriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
