import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationScoreController } from './application-score.controller';
import { ApplicationScoreService } from './application-score.service';

describe('ApplicationScoreController', () => {
  let controller: ApplicationScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationScoreController],
      providers: [ApplicationScoreService],
    }).compile();

    controller = module.get<ApplicationScoreController>(
      ApplicationScoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
