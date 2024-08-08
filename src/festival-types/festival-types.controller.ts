import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FestivalTypesService } from './festival-types.service';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';

@Controller('festival-types')
export class FestivalTypesController {
  constructor(private readonly festivalTypesService: FestivalTypesService) {}

  @Post()
  create(@Body() createFestivalTypeDto: CreateFestivalTypeDto) {
    return this.festivalTypesService.create(createFestivalTypeDto);
  }

  @Get()
  findAll() {
    return this.festivalTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivalTypesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivalTypesService.remove(+id);
  }
}
