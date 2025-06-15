import { PartialType } from '@nestjs/mapped-types';
import { CreateJuryDto } from './create-jury.dto';

export class UpdateJuryDto extends PartialType(CreateJuryDto) {
  imageDeleted?: string;
}
