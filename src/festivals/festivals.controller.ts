import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { FestivalsService } from './festivals.service';

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

  @Get('/:key/active')
  findActiveByName(@Param('key') key: string) {
    return this.festivalsService.findActiveByKey(key);
  }

  @Get('/type/:type')
  findByName(@Param('type') type: string) {
    return this.festivalsService.findByType(type);
  }
  @Get('/:type/config')
  findConfigByType(@Param('type') type: string) {
    return this.festivalsService.findConfigByType(type);
  }

  @Get('/:id/juries')
  findFestivalJuries(@Param('id') id: string) {
    return this.festivalsService.findFestivalJuries(+id);
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
