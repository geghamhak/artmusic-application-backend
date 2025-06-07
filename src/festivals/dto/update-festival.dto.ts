import { PartialType } from '@nestjs/mapped-types';
import { CreateFestivalDto } from './create-festival.dto';
import { IsOptional } from 'class-validator';

export class UpdateFestivalDto extends PartialType(CreateFestivalDto) {
  @IsOptional()
  bannerDeleted?: string[];
  @IsOptional()
  termsAndConditionsDeleted?: string[];
  @IsOptional()
  galleryDeleted?: string[];
}
