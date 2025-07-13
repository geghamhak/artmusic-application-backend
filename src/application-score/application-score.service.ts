import { Injectable } from '@nestjs/common';
import { CreateApplicationScoreDto } from './dto/create-application-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationScore } from './entities/application-score.entity';
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class ApplicationScoreService {
  constructor(
    @InjectRepository(ApplicationScore)
    private applicationScoreRepository: Repository<ApplicationScore>,
  ) {}
  async create(
    createApplicationScoreDto: CreateApplicationScoreDto,
  ): Promise<void> {
    const { scores, applicationId } = createApplicationScoreDto;
    for (const scoreToAdd of scores) {
      const applicationScore = new ApplicationScore();
      applicationScore.score = scoreToAdd;
      applicationScore.application = { id: applicationId } as Application;
      await this.applicationScoreRepository.save(applicationScore);
    }
  }
}
