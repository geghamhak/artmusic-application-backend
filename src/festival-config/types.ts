import { FestivalTypesEnum } from '../festival-types/festival-types.service';

export interface FestivalTypeConfig {
  compositionTotalDuration: number;
  hasNomination: boolean;
  hasRole: boolean;
  isOnline?: boolean;
  secondComposition?: boolean;
  thirdComposition?: boolean;
}

export type FestivalsConfig = {
  [key in FestivalTypesEnum]: FestivalTypeConfig;
};
export const FestivalsGlobalConfig: FestivalsConfig = {
  artmusic: {
    isOnline: true,
    secondComposition: true,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: true,
    hasRole: true,
  },
  melody: {
    isOnline: true,
    secondComposition: true,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: true,
    hasRole: false,
  },
  new_hands: {
    isOnline: false,
    secondComposition: false,
    thirdComposition: false,
    compositionTotalDuration: 0,
    hasNomination: true,
    hasRole: false,
  },
  lyrics: {
    isOnline: false,
    secondComposition: false,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: false,
    hasRole: false,
  },
  art_piano: {
    isOnline: false,
    secondComposition: true,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: false,
    hasRole: false,
  },
  khachatur_avetisyan: {
    isOnline: false,
    secondComposition: true,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: true,
    hasRole: true,
  },
  foreign: {
    isOnline: false,
    secondComposition: true,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: true,
    hasRole: true,
  },
  art_dance: {
    isOnline: false,
    secondComposition: true,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: true,
    hasRole: true,
  },
  eghegan_pogh: {
    isOnline: false,
    secondComposition: true,
    thirdComposition: false,
    compositionTotalDuration: 15,
    hasNomination: true,
    hasRole: true,
  },
};
