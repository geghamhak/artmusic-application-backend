import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {TextContent} from "../../translations/entities/textContent.entity";
import {Language} from "../../translations/entities/language.entity";
import {School} from "../../schools/entities/school.entity";
import {Region} from "../../regions/entities/region.entity";

const Schools = [
  {
    name: 'Ալեքսանդր Աճեմյանի անվան երաժշտական դպրոց',
    regionId: 11,
  },
  {
    name: 'Ալեքսանդր Սպենդիարյանի անվան  երաժշտական մասնագիտացված դպրոց',
    regionId: 11,
  },
  {
    name: 'Ալեքսեյ Հեքիմյանի անվան երաժշտական դպրոց',
    regionId: 11,
  },
  {
    name: 'Անահիտ Ցիցիկյանի անվան երաժշտական դպրոց',
    regionId: 11,
  },
  {
    name: 'Անուշավան Տեր-Ղևոնդյանի անվան երաժշտական դպրոց',
    regionId: 11,
  },
  {
    name: '"Աջափնյակ" գեղագիտական դաստիարակության կենտրոն',
    regionId: 11,
  },
  {
    name: 'Աջափնյակ վարչական շրջանի մանկապատանեկան տեխնիկական ստեղծագործության կենտրոն',
    regionId: 11,
  },
  {
    name: 'Ավանի մշակույթի տուն',
    regionId: 11,
  },
  {
    name: 'Ավետ Գաբրիելյանի անվան արվեստի դպրոց',
    regionId: 11,
  },
  {
    name: 'Ավետ Տերտերյանի անվան արվետի դպրոց',
    regionId: 11,
  },
  {
    name: 'Արմեն Տիգրանյանի անվան երաժշտական դպրոց',
    regionId: 11,
  },
  {
    name: 'Գուսան Աշխույժի անվան արվեստի դպրոց',
    regionId: 1,
  },
  {
    name: 'Արագածավանի Երաժշտական դպրոց',
    regionId: 1,
  },
  {
    name: 'Արտեմ Այվազյանի անվան երաժշտական դպրոց',
    regionId: 1,
  },
  {
    name: 'Գևորգ Ոսկանյանի անվան գեղարվեստի դպրոց',
    regionId: 1,
  },
  {
    name: 'Մայր Աթոռ Սուրբ Էջմիածնի Գուլամերյան հայոդյաց տուն',
    regionId: 1,
  },
  {
    name: 'Ապարանի Արվեստի դպրոց',
    regionId: 1,
  },
  {
    name: 'Թալինի Երաժշտական դպրոց',
    regionId: 1,
  },
  {
    name: 'Թալինի Մանկական գեղարվեստի դպրոց',
    regionId: 1,
  },
  {
    name: 'Կոշի Արվեստի դպրոց',
    regionId: 1,
  },
  {
    name: 'Ոսկեվազի Արվեստի դպրոց',
    regionId: 1,
  },
  {
    name: 'Ուջանի Երաժշտական դպրոց',
    regionId: 1,
  },
  {
    name: 'Օշականի Երաժշտական դպրոց',
    regionId: 1,
  },
];

export default class SchoolSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('DELETE FROM school');
    await dataSource.query('ALTER TABLE school AUTO_INCREMENT = 1');
    const regionRepository = dataSource.getRepository(School);
    const textContentRepository = dataSource.getRepository(TextContent);

    for (const school of Schools) {
      try {
        const newSchoolTextContent = await textContentRepository.save({
          originalText: school.name,
          originalLanguage: { id: 2 } as Language,
        });
        const newSchool = new School();
        newSchool.name = newSchoolTextContent;
        newSchool.region = { id: school.regionId } as Region;
        await regionRepository.save(newSchool);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
