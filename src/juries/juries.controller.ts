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
import {FileSystemStoredFile, FormDataRequest} from "nestjs-form-data";

@Controller('juries')
export class JuriesController {
  constructor(private readonly juriesService: JuriesService) {}

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
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

  @Delete(':id/:key')
  remove(@Param('id') id: string, @Param('key') key: string) {
    return this.juriesService.remove(+id, key);
  }
}
