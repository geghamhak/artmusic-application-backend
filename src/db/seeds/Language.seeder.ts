import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Language } from '../../translations/entities/language.entity';

const Languages = [
  {
    name: 'English',
    code: 'en',
  },
  {
    name: 'Armenian',
    code: 'am',
  },
  {
    name: 'Russian',
    code: 'ru',
  },
];

export default class LanguageSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "language" RESTART IDENTITY;');

    const repository = dataSource.getRepository(Language);
    Languages.map(async (language) => {
      await repository.insert({
        name: language.name,
        code: language.code,
      });
    });
  }
}
