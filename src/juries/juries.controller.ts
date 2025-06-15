import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JuriesService } from './juries.service';
import { CreateJuryDto } from './dto/create-jury.dto';
import { UpdateJuryDto } from './dto/update-jury.dto';

@Controller('juries')
export class JuriesController {
  constructor(private readonly juriesService: JuriesService) {}

  @Post()
  async create(@Body() createJuryDto: CreateJuryDto) {
    return await this.juriesService.create(createJuryDto);
  }

  @Get()
  async findAll() {
    return await this.juriesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJuryDto: UpdateJuryDto) {
    return this.juriesService.update(+id, updateJuryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, key: string) {
    return this.juriesService.remove(+id, key);
  }
}
