import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StaffPageService } from './staff-page.service';
import { CreateStaffPageDto } from './dto/create-staff-page.dto';
import { UpdateStaffPageDto } from './dto/update-staff-page.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('staff-page')
export class StaffPageController {
  constructor(private readonly staffPageService: StaffPageService) {}

  @Post()
  create(@Body() createStaffPageDto: CreateStaffPageDto) {
    return this.staffPageService.create(createStaffPageDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findOne() {
    return this.staffPageService.find();
  }

  @Patch()
  update(@Body() updateStaffPageDto: UpdateStaffPageDto) {
    return this.staffPageService.update(updateStaffPageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.staffPageService.remove(id);
  }
}
