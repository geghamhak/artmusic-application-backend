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

  determinePlaceByCentralizedSystem(
    score: number,
    scorePattern: string,
  ): CentralizedPlaces {
    const parsedScorePattern = JSON.parse(scorePattern);
    let centralizedPlace: CentralizedPlaces;
    for (const key in parsedScorePattern) {
      if (
        score >= parsedScorePattern[key][0] &&
        score <= parsedScorePattern[key][1]
      ) {
        centralizedPlace = parsedScorePattern[key];
      }
    }

    return centralizedPlace;
  }
}
