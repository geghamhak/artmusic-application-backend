import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';

export class CreateFestivalTypeDto {
  name: CreateTextContentDto[];
  description: CreateTextContentDto[];
  key: string;
  subNominationIds?: number[];
}
