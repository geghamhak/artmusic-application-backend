import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import { TranslationToMap } from './translations.interface';
import { TextContent } from './entities/textContent.entity';
import { Translation } from './entities/translation.entity';

export interface ITranslation {
  translation: string;
  language: Language;
  textContent: TextContent;
}

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation)
    private translationRepository: Repository<Translation>,
  ) {}

  mapTranslations(translationsToMap: TranslationToMap[]) {
    const mappedTranslations = [];
    translationsToMap.forEach((translationToMap: TranslationToMap) => {
      const translations = [];
      translationToMap.name.translations.map((value) => {
        translations.push({
          name: value.translation,
          code: value.language.code,
        });
      });
      mappedTranslations.push({
        id: translationToMap.id,
        translations: translations,
      });
    });

    return mappedTranslations;
  }

  async save(translation: ITranslation) {
    return await this.translationRepository.save(translation);
  }
}
