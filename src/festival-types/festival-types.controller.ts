import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  FestivalTypesEnum,
  FestivalTypesService,
} from './festival-types.service';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { UpdateFestivalDto } from '../festivals/dto/update-festival.dto';
import { UpdateFestivalTypeDto } from './dto/update-festival-type.dto';

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

  @Get('keys')
  findAllKeys() {
    return this.festivalTypesService.findAllKeys();
  }

  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.festivalTypesService.getByKey(name as FestivalTypesEnum);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFestivalTypeDto: UpdateFestivalTypeDto,
  ) {
    console.log(updateFestivalTypeDto);
    return this.festivalTypesService.update(+id, updateFestivalTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivalTypesService.remove(+id);
  }
}
