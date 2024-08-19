import { Controller, Get } from '@nestjs/common';
import { TranslationsService } from './translations.service';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get('languages')
  async findAllLanguages() {
    return await this.translationsService.findAllLanguages();
  }
}
