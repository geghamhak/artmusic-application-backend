import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  FestivalTypesEnum,
  FestivalTypesService,
} from './festival-types.service';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';

@Controller('festival-types')
export class FestivalTypesController {
  constructor(private readonly festivalTypesService: FestivalTypesService) {}

  @Post()
  create(@Body() createFestivalTypeDto: CreateFestivalTypeDto) {
    return this.festivalTypesService.create(createFestivalTypeDto);
  }

  @Get('keys')
  findAllKeys() {
    return this.festivalTypesService.findAllKeys();
  }

  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.festivalTypesService.getByKey(name as FestivalTypesEnum);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivalTypesService.remove(+id);
  }
}
