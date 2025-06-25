import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}
  async findAll() {
    const schools = await this.schoolRepository
      .createQueryBuilder('school')
      .leftJoinAndSelect('school.name', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('school.region', 'region')
      .select([
        'school.id',
        'region.id',
        'textContent.id',
        'translations.translation',
      ])
      .getMany();

    return schools.map((school) => {
      return {
        id: school.id,
        name: school.name.translations[0].translation,
        regionId: school.region.id,
      };
    });
  }

  findOne(id: number) {
    return this.schoolRepository.findOneBy({ id });
  }

  async findByName(school: string, languageCode: string) {
    return await this.schoolRepository
      .createQueryBuilder('school')
      .leftJoinAndSelect('school.name', 'textContent')
      .leftJoinAndSelect('school.region', 'region')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'translationLanguage')
      .where('translations.translation = :school', {
        school,
      })
      .andWhere('translationLanguage.code = :languageCode', {
        languageCode,
      })
      .select(['school.id', 'region.id'])
      .getOne();
  }
}
