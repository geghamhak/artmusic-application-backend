import { PartialType } from '@nestjs/mapped-types';
import { CreateScoringSystemDto } from './create-scoring-system.dto';

export class UpdateScoringSystemDto extends PartialType(CreateScoringSystemDto) {}
