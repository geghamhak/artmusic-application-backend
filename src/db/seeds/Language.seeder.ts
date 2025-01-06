import { Seeder } from 'typeorm-extension';
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
  ): Promise<void> {
    await dataSource.query('DELETE FROM language');
    await dataSource.query('ALTER TABLE language AUTO_INCREMENT = 1');
    const languageRepository = dataSource.getRepository(Language);

    for (const language of Languages) {
      try {
        const newLanguage = new Language();
        newLanguage.name = language.name;
        newLanguage.code = language.code;
        await languageRepository.save(newLanguage);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
