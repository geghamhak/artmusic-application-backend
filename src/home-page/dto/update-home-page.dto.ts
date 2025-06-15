import { PartialType } from '@nestjs/mapped-types';
import { CreateHomePageDto } from './create-home-page.dto';
import { IsOptional } from 'class-validator';

export class UpdateHomePageDto extends PartialType(CreateHomePageDto) {
  id: number;
  @IsOptional()
  imagesDeleted?: string[];
}
