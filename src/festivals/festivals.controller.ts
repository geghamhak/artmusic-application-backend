import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { FestivalsEnum, FestivalsService } from './festivals.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@Controller('festivals')
export class FestivalsController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createFestivalDto: CreateFestivalDto) {
    return this.festivalsService.create(createFestivalDto);
  }

  @Get()
  findAll() {
    return this.festivalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivalsService.findOne(+id);
  }

  @Get('/:name/active')
  findActiveByName(@Param('name') name: FestivalsEnum) {
    return this.festivalsService.findActiveByName(name);
  }

  @Get('/type/:type')
  findByName(@Param('type') type: FestivalsEnum) {
    return this.festivalsService.findByType(type);
  }

  @Patch(':id')
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(
    @Param('id') id: string,
    @Body() updateFestivalDto: UpdateFestivalDto,
  ) {
    return this.festivalsService.update(+id, updateFestivalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivalsService.remove(+id);
  }
}
