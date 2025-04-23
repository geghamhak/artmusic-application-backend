import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Language } from '../../translations/entities/language.entity';
import { Translation } from '../../translations/entities/translation.entity';
import { Country } from '../../countries/entities/country.entity';
import { getCodeList, getData } from 'country-list';

export default class CountrySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM country');
    await dataSource.query('ALTER TABLE country AUTO_INCREMENT = 1');
    const countryRepository = dataSource.getRepository(Country);
    const textContentRepository = dataSource.getRepository(TextContent);
    const translationRepository = dataSource.getRepository(Translation);

    const countries = getData();

    for (const country of countries) {
      try {
        const newRegionTextContent = await textContentRepository.save(
          new TextContent(),
        );
        if (country.code in ['AZ', 'TR']) {
          continue;
        }
        await countryRepository.save({
          name: { id: newRegionTextContent.id } as TextContent,
          code: country.code,
        });
        await translationRepository.save({
          translation: country.name,
          language: { id: 1 } as Language,
          textContent: { id: newRegionTextContent.id } as TextContent,
        });
      } catch (error) {
        throw error;
      }
    }
  }
}
