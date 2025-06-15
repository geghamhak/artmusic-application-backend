import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffPageDto } from './create-staff-page.dto';

export class UpdateStaffPageDto extends PartialType(CreateStaffPageDto) {
  id: number;
}
