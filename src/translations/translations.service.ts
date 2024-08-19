import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Festival } from '../festivals/entities/festival.entity';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import { TranslationToMap } from './translations.interface';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  findAllLanguages() {
    return this.languageRepository.find();
  }

  mapTranslations(translationsToMap: TranslationToMap[]) {
    const mappedTranslations = [];
    translationsToMap.forEach((translationToMap: TranslationToMap) => {
      const translations = [
        {
          name: translationToMap.name.originalText,
          code: translationToMap.name.originalLanguage.code,
        },
      ];

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
}
