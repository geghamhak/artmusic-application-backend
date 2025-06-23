import { Injectable } from '@nestjs/common';

export enum CentralizedPlaces {
  GRAND = 'GRAND',
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  DIPLOMA = 'DIPLOMA',
}
const centralizedScoreRanges = new Map();
centralizedScoreRanges.set([10.1, 10.1], CentralizedPlaces.GRAND);
centralizedScoreRanges.set([9.1, 10], CentralizedPlaces.FIRST);
centralizedScoreRanges.set([8.1, 9], CentralizedPlaces.SECOND);
centralizedScoreRanges.set([7.1, 8], CentralizedPlaces.THIRD);
centralizedScoreRanges.set([6.1, 7], CentralizedPlaces.DIPLOMA);

@Injectable()
export class ScoringSystemService {
  constructor() {}

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
}
