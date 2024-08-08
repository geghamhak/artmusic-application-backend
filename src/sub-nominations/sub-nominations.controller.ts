import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubNominationsService } from './sub-nominations.service';
import { CreateSubNominationDto } from './dto/create-sub-nomination.dto';

@Controller('sub-nominations')
export class SubNominationsController {
  constructor(private readonly subNominationsService: SubNominationsService) {}

  @Post()
  create(@Body() createSubNominationDto: CreateSubNominationDto) {
    return this.subNominationsService.create(createSubNominationDto);
  }

  @Get()
  findAll() {
    return this.subNominationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subNominationsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subNominationsService.remove(+id);
  }
}
