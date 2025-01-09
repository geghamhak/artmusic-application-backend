import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContent } from './entities/textContent.entity';
import { ITranslation, TranslationsService } from './translations.service';
import { Language } from './entities/language.entity';
import { TranslationDto } from './dto/create-text-content.dto';

@Injectable()
export class TextContentService {
  constructor(
    @InjectRepository(TextContent)
    private textContentRepository: Repository<TextContent>,
    private translationsService: TranslationsService,
  ) {}

  async create(): Promise<TextContent> {
    return this.textContentRepository.save(new TextContent());
  }

  async addTranslations(
    translations: TranslationDto[],
    languages: Language[],
  ): Promise<TextContent> {
    const textContent = await this.create();

    translations.map(async (nameTranslation) => {
      await this.translationsService.save({
        translation: nameTranslation.translation,
        language: {
          id: languages.find(
            (language: Language) =>
              language.code === nameTranslation.languageCode,
          ).id,
        } as Language,
        textContent: { id: textContent.id } as TextContent,
      });
    });

    return textContent;
  }
}
