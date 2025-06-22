import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Region } from '../../regions/entities/region.entity';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Language } from '../../translations/entities/language.entity';
import { Translation } from '../../translations/entities/translation.entity';

const Regions = [
  {
    name: 'Երևան',
  },
  {
    name: 'Արագածոտն',
  },
  {
    name: 'Արարատ',
  },
  {
    name: 'Արմավիր',
  },
  {
    name: 'Գեղարքունիք',
  },
  {
    name: 'Կոտայք',
  },
  {
    name: 'Լոռի',
  },
  {
    name: 'Շիրակ',
  },
  {
    name: 'Սյունիք',
  },
  {
    name: 'Տավուշ',
  },
  {
    name: 'Վայոց ձոր',
  },
];

export default class RegionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM region');
    await dataSource.query('ALTER TABLE region AUTO_INCREMENT = 1');
    const regionRepository = dataSource.getRepository(Region);
    const textContentRepository = dataSource.getRepository(TextContent);
    const translationRepository = dataSource.getRepository(Translation);

    for (const region of Regions) {
      try {
        const newRegionTextContent = await textContentRepository.save(
          new TextContent(),
        );
        await regionRepository.save({
          name: { id: newRegionTextContent.id } as TextContent,
        });
        await translationRepository.save({
          translation: region.name,
          language: { id: 2 } as Language,
          textContent: { id: newRegionTextContent.id } as TextContent,
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
