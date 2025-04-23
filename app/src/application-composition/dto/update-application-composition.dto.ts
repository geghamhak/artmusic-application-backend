import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationCompositionDto } from './create-application-composition.dto';

export class UpdateApplicationCompositionDto extends PartialType(
  CreateApplicationCompositionDto,
) {}
