import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HeaderService } from './header.service';
import { CreateHeaderDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@Controller('header')
export class HeaderController {
  constructor(private readonly headerService: HeaderService) {}

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createHeaderDto: CreateHeaderDto) {
    return this.headerService.create(createHeaderDto);
  }

  @Get()
  find() {
    return this.headerService.find();
  }

  @Patch()
  update(updateHeaderDto: UpdateHeaderDto) {
    return this.headerService.update(updateHeaderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.headerService.remove(+id);
  }
}
