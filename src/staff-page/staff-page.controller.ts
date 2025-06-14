import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffPageService } from './staff-page.service';
import { CreateStaffPageDto } from './dto/create-staff-page.dto';
import { UpdateStaffPageDto } from './dto/update-staff-page.dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { CreateHomePageDto } from '../home-page/dto/create-home-page.dto';
import { UpdateHomePageDto } from '../home-page/dto/update-home-page.dto';

@Controller('staff-page')
export class StaffPageController {
  constructor(private readonly staffPageService: StaffPageService) {}

  @Post()
  create(@Body() createStaffPageDto: CreateStaffPageDto) {
    return this.staffPageService.create(createStaffPageDto);
  }

  @Get()
  findOne() {
    return this.staffPageService.find();
  }

  @Patch()
  update(@Body() updateStaffPageDto: UpdateStaffPageDto) {
    return this.staffPageService.update(updateStaffPageDto);
  }
}
