import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ScoringSystem } from './entities/scoring-system.entity';
import { CreateScoringSystemDto } from './dto/create-scoring-system.dto';
import { FestivalType } from '../festival-types/entities/festival-type.entity';

export enum CentralizedPlaces {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  DIPLOMA = 'DIPLOMA',
}
const centralizedScoreRanges = new Map();
centralizedScoreRanges.set([10.1, 10.1], CentralizedPlaces.FIRST);
centralizedScoreRanges.set([9.1, 10], CentralizedPlaces.FIRST);
centralizedScoreRanges.set([8.1, 9], CentralizedPlaces.SECOND);
centralizedScoreRanges.set([7.1, 8], CentralizedPlaces.THIRD);
centralizedScoreRanges.set([6.1, 7], CentralizedPlaces.DIPLOMA);

@Injectable()
export class ScoringSystemService {
  constructor(
    @InjectRepository(ScoringSystem)
    private scoringSystemRepository: Repository<ScoringSystem>,
  ) {}

  async determinePlaceByScore(score: number) {
    return await this.scoringSystemRepository.findOneBy({
      minAmount: MoreThanOrEqual(score),
      maxAmount: MoreThanOrEqual(score),
    });
  }

  determinePlaceByCentralizedSystem(score: number): CentralizedPlaces {
    let centralizedPlace: CentralizedPlaces;

    centralizedScoreRanges.forEach(
      (centralizedScoreValue, centralizedScoreKey) => {
        if (
          score >= centralizedScoreKey[0] &&
          score <= centralizedScoreKey[1]
        ) {
          centralizedPlace = centralizedScoreValue;
        }
      },
    );

    return centralizedPlace;
  }

  create(createScoringSystem: CreateScoringSystemDto) {
    return this.scoringSystemRepository.create(createScoringSystem);
  }
}
