import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';
import { FestivalsEnum } from '../festivals.service';

export class CreateFestivalDto {
  festivalType: FestivalsEnum;
  name: CreateTextContentDto;
  description: CreateTextContentDto;
  isActive: boolean;
}
