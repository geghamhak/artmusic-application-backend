import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async getAllLanguages(): Promise<Language[]> {
    return await this.languageRepository
      .createQueryBuilder('language')
      .select(['language.id', 'language.code'])
      .getMany();
  }
}
