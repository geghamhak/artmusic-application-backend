import { Controller, Get } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { LanguageService } from './language.service';

@Controller('translations')
export class TranslationsController {
  constructor(
    private readonly translationsService: TranslationsService,
    private languageService: LanguageService,
  ) {}

  @Get('languages')
  findAll() {
    return this.languageService.getAllLanguages();
  }
}
