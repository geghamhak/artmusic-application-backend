import { PartialType } from '@nestjs/mapped-types';
import { CreateFestivalConfigDto } from './create-festival-config.dto';

export class UpdateFestivalConfigDto extends PartialType(
  CreateFestivalConfigDto,
) {}
