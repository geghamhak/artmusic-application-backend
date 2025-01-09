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
}
