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

  async update(translation: Translation) {
    return await this.translationRepository.update(translation.id, translation);
  }

  async getByTextContentId(textContentId: number): Promise<Translation[]> {
    return await this.translationRepository
      .createQueryBuilder('translations')
      .leftJoinAndSelect('translations.textContent', 'textContent')
      .leftJoinAndSelect('translations.language', 'language')
      .where('translations.textContent = :textContentId', { textContentId })
      .select([
        'translations.id',
        'textContent.id',
        'language.code',
        'translations.translation',
      ])
      .getMany();
  }
}
