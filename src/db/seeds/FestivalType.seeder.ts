import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Language } from '../../translations/entities/language.entity';
import { Translation } from '../../translations/entities/translation.entity';
import { FestivalType } from '../../festival-types/entities/festival-type.entity';
import { FestivalTypesEnum } from '../../festival-types/festival-types.service';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';

const FestivalTypes = [
  {
    key: FestivalTypesEnum.ARTMUSIC,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Art Music',
        },
        {
          languageCode: 'ru',
          translation: 'Артмюзик',
        },
        {
          languageCode: 'am',
          translation: 'Արտմյուզիք',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Festival of Fine Arts',
        },
        {
          languageCode: 'am',
          translation: 'Գեղեցիկ արվեստների փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Фестиваль изящных искусств',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.NEW_HANDS,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'New Hands',
        },
        {
          languageCode: 'ru',
          translation: 'Новые Руки',
        },
        {
          languageCode: 'am',
          translation: 'Նոր Ձեռքեր',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Craft And Painting Festival',
        },
        {
          languageCode: 'am',
          translation: 'Ձեռնարկների և նկարների փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Фестиваль ремёсел и живописи',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.MELODY,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Melody',
        },
        {
          languageCode: 'ru',
          translation: 'Мелодия',
        },
        {
          languageCode: 'am',
          translation: 'Մեղեդի',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Festival of Singing',
        },
        {
          languageCode: 'am',
          translation: 'Երգի փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Фестиваль пения',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.LYRICS,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Lyrics',
        },
        {
          languageCode: 'ru',
          translation: 'Лирика',
        },
        {
          languageCode: 'am',
          translation: 'Լիրիկա',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Festival of Lyrics',
        },
        {
          languageCode: 'am',
          translation: 'Երգերի փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Фестиваль текстов песен',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.KHACHATUR_AVETISYAN,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Khachatur Avetisyan',
        },
        {
          languageCode: 'ru',
          translation: 'Хачатур Аветисян',
        },
        {
          languageCode: 'am',
          translation: 'Խաչատուր Ավետիսյան',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Festival after Khachatur Avetisya',
        },
        {
          languageCode: 'am',
          translation: 'Փառատոն՝ նվիրված Խաչատուր Ավետիսյանին',
        },
        {
          languageCode: 'ru',
          translation: 'Фестиваль имени Хачатура Аветисяна',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.ART_PIANO,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Art Piano',
        },
        {
          languageCode: 'ru',
          translation: 'Арт Пиано',
        },
        {
          languageCode: 'am',
          translation: 'Արտ Պիանո',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Piano Festival',
        },
        {
          languageCode: 'am',
          translation: 'Դաշնամուրի փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Фестиваль фортепиано',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.FOREIGN,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Foreign',
        },
        {
          languageCode: 'ru',
          translation: 'Иностранный',
        },
        {
          languageCode: 'am',
          translation: 'Արտերկրյա',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Foreign Festival',
        },
        {
          languageCode: 'am',
          translation: 'Օտար փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Иностранный фестиваль',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.ART_DANCE,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Art Dance',
        },
        {
          languageCode: 'ru',
          translation: 'Арт Дэнс',
        },
        {
          languageCode: 'am',
          translation: 'Արտ Դենս',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Dance Festival',
        },
        {
          languageCode: 'am',
          translation: 'Պարերի փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Танцевальный фестиваль',
        },
      ],
    },
  },
  {
    key: FestivalTypesEnum.EGHEGAN_POGH,
    translations: {
      name: [
        {
          languageCode: 'en',
          translation: 'Eghegan Pogh',
        },
        {
          languageCode: 'ru',
          translation: 'Егеган Пог',
        },
        {
          languageCode: 'am',
          translation: 'Եղեգան Փող',
        },
      ],
      description: [
        {
          languageCode: 'en',
          translation: 'Eghegan Pogh Festival',
        },
        {
          languageCode: 'am',
          translation: 'Եղեգան փողի փառատոն',
        },
        {
          languageCode: 'ru',
          translation: 'Фестиваль дудука',
        },
      ],
    },
  },
];

export default class FestivalTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const languageIds = [
      { code: 'am', id: 2 },
      { code: 'en', id: 1 },
      { code: 'ru', id: 3 },
    ];
    await dataSource.query('DELETE FROM festival_type');
    await dataSource.query('ALTER TABLE festival_type AUTO_INCREMENT = 1');
    const festivalTypeRepository = dataSource.getRepository(FestivalType);
    const textContentRepository = dataSource.getRepository(TextContent);
    const translationRepository = dataSource.getRepository(Translation);
    const subNominationRepository = dataSource.getRepository(SubNomination);
    const allSubNominations = await subNominationRepository
      .createQueryBuilder('subNomination')
      .select('subNomination.id')
      .getMany();
    const subNominationIds = allSubNominations.map(
      (subNomination) => subNomination.id,
    );
    for (const festivalType of FestivalTypes) {
      try {
        const newNameFestivalTypeTextContent = await textContentRepository.save(
          new TextContent(),
        );
        const newDescriptionFestivalTypeTextContent =
          await textContentRepository.save(new TextContent());
        await festivalTypeRepository.save({
          name: { id: newNameFestivalTypeTextContent.id } as TextContent,
          description: {
            id: newDescriptionFestivalTypeTextContent.id,
          } as TextContent,
          key: festivalType.key,
          subNominationIds: subNominationIds,
        });
        festivalType.translations.name.map(async (translation) => {
          await translationRepository.save({
            translation: translation.translation,
            language: {
              id: languageIds.find(
                (languageId) => languageId.code === translation.languageCode,
              ).id,
            } as Language,
            textContent: {
              id: newNameFestivalTypeTextContent.id,
            } as TextContent,
          });
        });
        festivalType.translations.description.map(async (translation) => {
          await translationRepository.save({
            translation: translation.translation,
            language: {
              id: languageIds.find(
                (languageId) => languageId.code === translation.languageCode,
              ).id,
            } as Language,
            textContent: {
              id: newDescriptionFestivalTypeTextContent.id,
            } as TextContent,
          });
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
