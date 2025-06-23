import { Controller, Post, Body } from '@nestjs/common';
import { ApplicationScoreService } from './application-score.service';
import { CreateApplicationScoreDto } from './dto/create-application-score.dto';

@Controller('application-score')
export class ApplicationScoreController {
  constructor(
    private readonly applicationScoreService: ApplicationScoreService,
  ) {}

  @Post()
  create(@Body() createApplicationScoreDto: CreateApplicationScoreDto, applicationId: number) {
    return this.applicationScoreService.create(createApplicationScoreDto, applicationId);
  }
}
