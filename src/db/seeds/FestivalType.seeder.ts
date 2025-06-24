import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Language } from '../../translations/entities/language.entity';
import { Translation } from '../../translations/entities/translation.entity';
import { FestivalType } from '../../festival-types/entities/festival-type.entity';
import { FestivalTypesEnum } from '../../festival-types/festival-types.service';

const FestivalTypes = [
  {
    key: FestivalTypesEnum.ARTMUSIC,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.NEW_HANDS,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.MELODY,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.LYRICS,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.KHACHATUR_AVETISYAN,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.ART_PIANO,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.FOREIGN,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.ART_DANCE,
    translations: [
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
  },
  {
    key: FestivalTypesEnum.EGHEGAN_POGH,
    translations: [
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

    for (const festivalType of FestivalTypes) {
      try {
        const newFestivalTypeTextContent = await textContentRepository.save(
          new TextContent(),
        );
        await festivalTypeRepository.save({
          name: { id: newFestivalTypeTextContent.id } as TextContent,
          key: festivalType.key,
        });
        festivalType.translations.map(async (translation) => {
          await translationRepository.save({
            translation: translation.translation,
            language: {
              id: languageIds.find(
                (languageId) => languageId.code === translation.languageCode,
              ).id,
            } as Language,
            textContent: { id: newFestivalTypeTextContent.id } as TextContent,
          });
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
