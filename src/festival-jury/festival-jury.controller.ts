import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FestivalJuryService } from './festival-jury.service';
import { CreateFestivalJuryDto } from './dto/create-festival-jury.dto';
import { UpdateFestivalJuryDto } from './dto/update-festival-jury.dto';

@Controller('festival-jury')
export class FestivalJuryController {
  constructor(private readonly festivalJuryService: FestivalJuryService) {}

  @Post()
  create(@Body() createFestivalJuryDto: CreateFestivalJuryDto) {
    return this.festivalJuryService.create(createFestivalJuryDto);
  }

  @Get()
  findAll() {
    return this.festivalJuryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivalJuryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFestivalJuryDto: UpdateFestivalJuryDto,
  ) {
    return this.festivalJuryService.update(+id, updateFestivalJuryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivalJuryService.remove(+id);
  }
}
