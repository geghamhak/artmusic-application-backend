import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Language } from '../../translations/entities/language.entity';
import { Translation } from '../../translations/entities/translation.entity';
import { Jury } from '../../juries/entities/jury.entity';

const names = [
  [
    {
      name: 'Արամ Սարգսյան',
      description: 'Ճանաչված ջազ դաշնակահար',
      languageCode: 1,
    },
    {
      name: 'Aram Sargsyan',
      description: 'Renowned jazz pianist',
      languageCode: 2,
    },
    {
      name: 'Арам Саргсян',
      description: 'Известный джазовый пианист',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Տիգրան Գրիգորյան',
      description: 'Ակադեմիական վոկալի մասնագետ',
      languageCode: 1,
    },
    {
      name: 'Tigran Grigoryan',
      description: 'Academic vocal specialist',
      languageCode: 2,
    },
    {
      name: 'Тигран Григорян',
      description: 'Специалист по академическому вокалу',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Վարդան Հարությունյան',
      description: 'Շեփորի մենակատար պետական նվագախմբում',
      languageCode: 1,
    },
    {
      name: 'Vardan Harutyunyan',
      description: 'Principal trumpeter in the state orchestra',
      languageCode: 2,
    },
    {
      name: 'Вардан Арутюнян',
      description: 'Солист-трубач в государственном оркестре',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Գևորգ Մարտիրոսյան',
      description: 'Երգահան և գործիքավորող',
      languageCode: 1,
    },
    {
      name: 'Gevorg Martirosyan',
      description: 'Composer and arranger',
      languageCode: 2,
    },
    {
      name: 'Геворг Мартиросян',
      description: 'Композитор и аранжировщик',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Նարեկ Ավետիսյան',
      description: 'Ժողովրդական երաժշտության կատարող',
      languageCode: 1,
    },
    {
      name: 'Narek Avetisyan',
      description: 'Folk music performer',
      languageCode: 2,
    },
    {
      name: 'Нарек Аветисян',
      description: 'Исполнитель народной музыки',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Հայկ Պետրոսյան',
      description: 'Սիմֆոնիկ նվագախմբի դիրիժոր',
      languageCode: 1,
    },
    {
      name: 'Hayk Petrosyan',
      description: 'Conductor of symphony orchestra',
      languageCode: 2,
    },
    {
      name: 'Айк Петросян',
      description: 'Дирижер симфонического оркестра',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Սևակ Աբրահամյան',
      description: 'Էթնո-ջազ խմբի հիմնադիր',
      languageCode: 1,
    },
    {
      name: 'Sevak Abrahamyan',
      description: 'Founder of ethno-jazz band',
      languageCode: 2,
    },
    {
      name: 'Севак Абраамян',
      description: 'Основатель этно-джаз группы',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Աշոտ Խաչատրյան',
      description: 'Դուդուկի վարպետ',
      languageCode: 1,
    },
    {
      name: 'Ashot Khachatryan',
      description: 'Master of the duduk',
      languageCode: 2,
    },
    {
      name: 'Ашот Хачатрян',
      description: 'Мастер дудука',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Կարեն Կարապետյան',
      description: 'Էլեկտրոնային երաժշտության պրոդյուսեր',
      languageCode: 1,
    },
    {
      name: 'Karen Karapetyan',
      description: 'Electronic music producer',
      languageCode: 2,
    },
    {
      name: 'Карен Карапетян',
      description: 'Продюсер электронной музыки',
      languageCode: 3,
    },
  ],
  [
    {
      name: 'Սամվել Բաղդասարյան',
      description: 'Գիթառահար ռոք խմբում',
      languageCode: 1,
    },
    {
      name: 'Samvel Baghdasaryan',
      description: 'Guitarist in a rock band',
      languageCode: 2,
    },
    {
      name: 'Самвел Багдасарян',
      description: 'Гитарист в рок-группе',
      languageCode: 3,
    },
  ],
];

export default class JurySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM jury');
    await dataSource.query('ALTER TABLE jury AUTO_INCREMENT = 1');
    const juryRepository = dataSource.getRepository(Jury);
    const textContentRepository = dataSource.getRepository(TextContent);
    const translationRepository = dataSource.getRepository(Translation);
    let counter = 0;
    for (const juryContext of names) {
      try {
        counter++;
        const newNameTextContent = await textContentRepository.save(
          new TextContent(),
        );
        const newDescriptionTextContent = await textContentRepository.save(
          new TextContent(),
        );
        const newJury = await juryRepository.save({
          name: { id: newNameTextContent.id } as TextContent,
          description: { id: newDescriptionTextContent.id } as TextContent,
        });

        for (const jury of juryContext) {
          await translationRepository.save({
            translation: jury.name,
            language: { id: jury.languageCode } as Language,
            textContent: { id: newNameTextContent.id } as TextContent,
          });
          await translationRepository.save({
            translation: jury.description,
            language: { id: jury.languageCode } as Language,
            textContent: { id: newDescriptionTextContent.id } as TextContent,
          });
        }
      } catch (error) {
        throw error;
      }
    }
  }
}
