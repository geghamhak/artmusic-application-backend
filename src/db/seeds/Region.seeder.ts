import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {Region} from "../../regions/entities/region.entity";
import {TextContent} from "../../translations/entities/textContent.entity";
import {Language} from "../../translations/entities/language.entity";

const Regions = [
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
  {
    name: 'Երևան',
  },
];

export default class RegionSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('DELETE FROM region');
    await dataSource.query('ALTER TABLE region AUTO_INCREMENT = 1');
    const regionRepository = dataSource.getRepository(Region);
    const textContentRepository = dataSource.getRepository(TextContent);

    for (const region of Regions) {
      try {
        const newRegionTextContent = await textContentRepository.save({
          originalText: region.name,
          originalLanguage: { id: 2 } as Language,
        });
        const newRegion = new Region();
        newRegion.name = newRegionTextContent;
        await regionRepository.save(newRegion);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
