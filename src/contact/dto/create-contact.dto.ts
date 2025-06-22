import { CreateTextContentDto } from 'src/translations/dto/create-text-content.dto';

export class CreateContactDto {
  information: CreateTextContentDto[];
  location: string;
}
