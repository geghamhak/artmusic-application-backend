import { Injectable } from '@nestjs/common';

export enum CentralizedPlaces {
  GRAND = 'GRAND',
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  DIPLOMA = 'DIPLOMA',
}
export const CentralizedScoringPattern = {
  FIRST: [9.1, 10],
  SECOND: [8.1, 9],
  THIRD: [7.1, 8],
  DIPLOMA: [6.1, 7],
};

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
    for (const key in CentralizedScoringPattern) {
      if (
        score >= CentralizedScoringPattern[key][0] &&
        score <= CentralizedScoringPattern[key][1]
      ) {
        centralizedPlace = CentralizedScoringPattern[key];
      }
    }

    return centralizedPlace;
  }
}
