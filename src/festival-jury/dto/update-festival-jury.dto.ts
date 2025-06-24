import { PartialType } from '@nestjs/mapped-types';
import { CreateFestivalJuryDto } from './create-festival-jury.dto';

export class UpdateFestivalJuryDto extends PartialType(CreateFestivalJuryDto) {}
