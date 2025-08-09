import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';

export class CreateFestivalTypeDto {
  name: CreateTextContentDto[];
  description: CreateTextContentDto[];
  key: string;
  subNominationIds?: number[];
  isOnline: boolean;
  secondComposition: boolean;
  thirdComposition: boolean;
  compositionTotalDuration: number;
  isParticipantTypeActive: boolean;
}
