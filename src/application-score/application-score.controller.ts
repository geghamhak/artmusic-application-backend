import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApplicationScoreService } from './application-score.service';
import { CreateApplicationScoreDto } from './dto/create-application-score.dto';

@Controller('application-score')
export class ApplicationScoreController {
  constructor(
    private readonly applicationScoreService: ApplicationScoreService,
  ) {}

  @Post()
  create(@Body() createApplicationScoreDto: CreateApplicationScoreDto) {
    return this.applicationScoreService.create(createApplicationScoreDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationScoreService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationScoreService.remove(+id);
  }
}
