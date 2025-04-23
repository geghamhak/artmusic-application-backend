import { Test, TestingModule } from '@nestjs/testing';
import { SubNominationsController } from './sub-nominations.controller';
import { SubNominationsService } from './sub-nominations.service';

describe('SubNominationsController', () => {
  let controller: SubNominationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubNominationsController],
      providers: [SubNominationsService],
    }).compile();

    controller = module.get<SubNominationsController>(SubNominationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
