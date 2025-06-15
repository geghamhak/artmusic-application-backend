import { PartialType } from '@nestjs/mapped-types';
import { CreateHeaderDto } from './create-header.dto';
import { IsOptional } from 'class-validator';
export class UpdateHeaderDto extends PartialType(CreateHeaderDto) {
  id: number;
  @IsOptional()
  bannerDeleted?: string[];
  @IsOptional()
  logoDeleted?: string[];
}
