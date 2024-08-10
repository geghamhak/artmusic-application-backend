import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ScoringSystem } from './entities/scoring-system.entity';
import { CreateScoringSystemDto } from './dto/create-scoring-system.dto';

@Injectable()
export class ScoringSystemService {
  constructor(
    @InjectRepository(ScoringSystem)
    private scoringSystemRepository: Repository<ScoringSystem>,
  ) {}

  async determinePlaceByScore(score: number, festivalTypeId) {
    return await this.scoringSystemRepository.findOneBy({
      minAmount: MoreThanOrEqual(score),
      maxAmount: MoreThanOrEqual(score),
      festivalType: festivalTypeId,
    });
  }

  findAll() {
    return this.scoringSystemRepository.find();
  }

  findOne(id: number) {
    return this.scoringSystemRepository.findOneBy({ id });
  }
  create(createScoringSystem: CreateScoringSystemDto) {
    return this.scoringSystemRepository.create(createScoringSystem);
  }
}
