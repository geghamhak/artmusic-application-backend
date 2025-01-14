import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

export interface ICountry {
  id: number;
  code: string;
  name: string;
}
@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}
  async findAll(): Promise<ICountry[]> {
    const countries = await this.countryRepository
      .createQueryBuilder('country')
      .leftJoinAndSelect('country.name', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .select([
        'country.id',
        'country.code',
        'textContent.id',
        'translations.translation',
      ])
      .getMany();
    const countriesList: ICountry[] = [];
    countries.map((country) => {
      countriesList.push({
        id: country.id,
        code: country.code,
        name: country.name.translations[0].translation,
      });
    });
    return countriesList;
  }

  findOne(id: number) {
    return this.countryRepository.findOneBy({ id });
  }
}
