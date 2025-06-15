import { PartialType } from '@nestjs/mapped-types';
import { CreateFestivalImageDto } from './create-festival-image.dto';

export class UpdateFestivalImageDto extends PartialType(
  CreateFestivalImageDto,
) {}
