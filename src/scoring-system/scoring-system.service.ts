import { Injectable } from '@nestjs/common';

export enum CentralizedPlaces {
  GRAND = 'GRAND',
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  DIPLOMA = 'DIPLOMA',
}
export const CentralizedScoringPattern = new Map<CentralizedPlaces, number[]>();
CentralizedScoringPattern.set(CentralizedPlaces.GRAND, [10.1, 10.1]);
CentralizedScoringPattern.set(CentralizedPlaces.FIRST, [9.1, 10]);
CentralizedScoringPattern.set(CentralizedPlaces.SECOND, [8.1, 9]);
CentralizedScoringPattern.set(CentralizedPlaces.THIRD, [7.1, 8]);
CentralizedScoringPattern.set(CentralizedPlaces.DIPLOMA, [6.1, 7]);

export interface CreateScoringItem {
  minRange: number;
  maxRange: number;
  place: CentralizedPlaces;
}

@Injectable()
export class ScoringSystemService {
  constructor() {}

  determinePlaceByCentralizedSystem(score: number): CentralizedPlaces {
    let centralizedPlace: CentralizedPlaces;

    CentralizedScoringPattern.forEach(
      (centralizedScoreValue, centralizedScoreKey) => {
        if (
          score >= centralizedScoreValue[0] &&
          score <= centralizedScoreValue[1]
        ) {
          centralizedPlace = centralizedScoreKey;
        }
      },
    );

    return centralizedPlace;
  }
}
