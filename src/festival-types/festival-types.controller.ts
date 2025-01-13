import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FestivalTypesService } from './festival-types.service';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { FestivalsEnum } from '../festivals/festivals.service';

@Controller('festival-types')
export class FestivalTypesController {
  constructor(private readonly festivalTypesService: FestivalTypesService) {}

  @Post()
  create(@Body() createFestivalTypeDto: CreateFestivalTypeDto) {
    return this.festivalTypesService.create(createFestivalTypeDto);
  }

  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.festivalTypesService.getByKey(name as FestivalsEnum);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivalTypesService.remove(+id);
  }
}
