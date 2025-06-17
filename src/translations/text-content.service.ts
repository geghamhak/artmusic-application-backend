import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContent } from './entities/textContent.entity';
import { TranslationsService } from './translations.service';
import { Language } from './entities/language.entity';
import { CreateTextContentDto } from './dto/create-text-content.dto';
import { Translation } from './entities/translation.entity';
import { LanguageService } from './language.service';

@Injectable()
export class TextContentService {
  private allLanguages: Language[];
  constructor(
    @InjectRepository(TextContent)
    private textContentRepository: Repository<TextContent>,
    private translationsService: TranslationsService,
    private languageService: LanguageService,
  ) {}

  async getLanguages() {
    if (this.allLanguages.length) {
      return this.allLanguages;
    }
    this.allLanguages = await this.languageService.getAllLanguages();
    return this.allLanguages;
  }

  async create(): Promise<TextContent> {
    return this.textContentRepository.save(new TextContent());
  }

  async addTranslations(
    translations: CreateTextContentDto[],
  ): Promise<TextContent> {
    const textContent = await this.create();
    const languages = await this.getLanguages();
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

  async addTranslation(
    translation: CreateTextContentDto,
  ): Promise<TextContent> {
    const textContent = await this.create();
    const languages = await this.languageService.getAllLanguages();
    await this.translationsService.save({
      translation: translation.translation,
      language: {
        id: languages.find(
          (language: Language) => language.code === translation.languageCode,
        ).id,
      } as Language,
      textContent: { id: textContent.id } as TextContent,
    });

    return textContent;
  }

  async updateTranslations(
    textContent: TextContent,
    translations: CreateTextContentDto[],
  ): Promise<TextContent> {
    const existingTranslations =
      await this.translationsService.getByTextContentId(+textContent.id);

    existingTranslations.map(async ({ id, language }) => {
      const { translation } = translations.find(
        (translation) => translation.languageCode === language.code,
      );
      await this.translationsService.update({ id, translation } as Translation);
    });

    return textContent;
  }
}
