import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Language } from '../../translations/entities/language.entity';
import { Nomination } from '../../nominations/entities/nomination.entity';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Translation } from '../../translations/entities/translation.entity';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';

const Nominations = [
  {
    name: 'Ստեղնային նվագարաններ',
    originalLanguage: 'am',
    priority: 1,
    translations: [
      {
        name: 'Keyboards',
        languageCode: 'en',
      },
      {
        name: 'Клавишные инструменты',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Դաշնամուր',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Piano',
            languageCode: 'en',
          },
          {
            name: 'Фортепиано',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Սինթեզատոր',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Synthesizer',
            languageCode: 'en',
          },
          {
            name: 'Синтезатор',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Լարային դասական նվագարաններ',
    originalLanguage: 'am',
    priority: 2,
    translations: [
      {
        name: 'Classic Strings',
        languageCode: 'en',
      },
      {
        name: 'Классические струнные инструменты',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Ջութակ',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Violin',
            languageCode: 'en',
          },
          {
            name: 'Скрипка',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ալտ',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Viola',
            languageCode: 'en',
          },
          {
            name: 'Альт',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Թավջութակ',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Cello',
            languageCode: 'en',
          },
          {
            name: 'Виолончель',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Կոնտրաբաս',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Contrabass',
            languageCode: 'en',
          },
          {
            name: 'Контрабас',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Տավիղ',
        originalLanguage: 'am',
        priority: 5,
        translations: [
          {
            name: 'Harp',
            languageCode: 'en',
          },
          {
            name: 'Арфа',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Կիթառ',
        originalLanguage: 'am',
        priority: 6,
        translations: [
          {
            name: 'Guitar',
            languageCode: 'en',
          },
          {
            name: 'Гитара',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Փողային նվագարաններ',
    originalLanguage: 'am',
    priority: 3,
    translations: [
      {
        name: 'Classic Brass',
        languageCode: 'en',
      },
      {
        name: 'Духовые инструменты',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Ֆլեյտա',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Flute',
            languageCode: 'en',
          },
          {
            name: 'Флейта',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Պիկոլո-ֆլեյտա',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Flute piccolo',
            languageCode: 'en',
          },
          {
            name: 'Флейта пикколо',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Բլոկ-ֆլեյտա',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Block flute',
            languageCode: 'en',
          },
          {
            name: 'Блок-флейта',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հոբոյ',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Oboe',
            languageCode: 'en',
          },
          {
            name: 'Гобой',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Կլարնետ',
        originalLanguage: 'am',
        priority: 5,
        translations: [
          {
            name: 'Clarinet',
            languageCode: 'en',
          },
          {
            name: 'Кларнет',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ֆագոտ',
        originalLanguage: 'am',
        priority: 6,
        translations: [
          {
            name: 'Bassoon',
            languageCode: 'en',
          },
          {
            name: 'Фагот',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Սակսոֆոն',
        originalLanguage: 'am',
        priority: 7,
        translations: [
          {
            name: 'Saxophone',
            languageCode: 'en',
          },
          {
            name: 'Саксофон',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Բյուգելհորն',
        originalLanguage: 'am',
        priority: 8,
        translations: [
          {
            name: 'Bugle',
            languageCode: 'en',
          },
          {
            name: 'Горн',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Շեփոր',
        originalLanguage: 'am',
        priority: 9,
        translations: [
          {
            name: 'Trumpet',
            languageCode: 'en',
          },
          {
            name: 'Труба',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Տրոմբոն',
        originalLanguage: 'am',
        priority: 10,
        translations: [
          {
            name: 'Trombone',
            languageCode: 'en',
          },
          {
            name: 'Тромбон',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Գալարափող',
        originalLanguage: 'am',
        priority: 11,
        translations: [
          {
            name: 'French horn',
            languageCode: 'en',
          },
          {
            name: 'Валторна',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Տենոր',
        originalLanguage: 'am',
        priority: 12,
        translations: [
          {
            name: 'Tenor',
            languageCode: 'en',
          },
          {
            name: 'Тенор',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Բարիտոն',
        originalLanguage: 'am',
        priority: 13,
        translations: [
          {
            name: 'Baritone',
            languageCode: 'en',
          },
          {
            name: 'Баритон',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Տուբա',
        originalLanguage: 'am',
        priority: 14,
        translations: [
          {
            name: 'Tuba',
            languageCode: 'en',
          },
          {
            name: 'Туба',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Հարվածային նվագարաններ',
    originalLanguage: 'am',
    priority: 4,
    translations: [
      {
        name: 'Percussion',
        languageCode: 'en',
      },
      {
        name: 'Ударные инструменты',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Քսիլոֆոն / Մարիմբա / Վիբրաֆոն / Գլոկ',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Xylophone / Marimba / Vibraphone / Glock',
            languageCode: 'en',
          },
          {
            name: 'Ксилофон / Маримба / Вибрафон / Глок',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հարվածային նվագարանների հավաքածու / Մեծ թմբուկ / Փոքր թմբուկ / Ծնծղա / այլ',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Drum Kit / Bass Drum / Snare Drum / Cymbal / others',
            languageCode: 'en',
          },
          {
            name: 'Ударный комплект / Большой барабан / Малый барабан / Тарелка / другие',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Հայկական ազգային նվագարաններ',
    originalLanguage: 'am',
    priority: 5,
    translations: [
      {
        name: 'Armenian national orchestras',
        languageCode: 'en',
      },
      {
        name: 'Армянские национальные инструменты',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Քանոն',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Qanon',
            languageCode: 'en',
          },
          {
            name: 'Канон',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Սանթուր',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Santur',
            languageCode: 'en',
          },
          {
            name: 'Сантур',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Քամանչա',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Qamancha',
            languageCode: 'en',
          },
          {
            name: 'Каманча',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Քամանի / Բամբիռ',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Qamani / Bambir',
            languageCode: 'en',
          },
          {
            name: 'Камани / Бамбир',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Թառ',
        originalLanguage: 'am',
        priority: 5,
        translations: [
          {
            name: 'Tar',
            languageCode: 'en',
          },
          {
            name: 'Тар',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Սազ',
        originalLanguage: 'am',
        priority: 6,
        translations: [
          {
            name: 'Saz',
            languageCode: 'en',
          },
          {
            name: 'Саз',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ուդ',
        originalLanguage: 'am',
        priority: 7,
        translations: [
          {
            name: 'Ud',
            languageCode: 'en',
          },
          {
            name: 'Уд',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Շվի',
        originalLanguage: 'am',
        priority: 8,
        translations: [
          {
            name: 'Shvi',
            languageCode: 'en',
          },
          {
            name: 'Шви',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Սրինգ',
        originalLanguage: 'am',
        priority: 9,
        translations: [
          {
            name: 'Sring',
            languageCode: 'en',
          },
          {
            name: 'Сринг',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Դուդուկ',
        originalLanguage: 'am',
        priority: 10,
        translations: [
          {
            name: 'Duduk',
            languageCode: 'en',
          },
          {
            name: 'Дудук',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Պկու',
        originalLanguage: 'am',
        priority: 11,
        translations: [
          {
            name: 'Pku',
            languageCode: 'en',
          },
          {
            name: 'Пку',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Զուրնա',
        originalLanguage: 'am',
        priority: 12,
        translations: [
          {
            name: 'Zurna',
            languageCode: 'en',
          },
          {
            name: 'Зурна',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Պարկապզուկ',
        originalLanguage: 'am',
        priority: 13,
        translations: [
          {
            name: 'Parkapzuk',
            languageCode: 'en',
          },
          {
            name: 'Паркапзук',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Շրթհարմոն',
        originalLanguage: 'am',
        priority: 14,
        translations: [
          {
            name: 'Harmonica',
            languageCode: 'en',
          },
          {
            name: 'Губная гармонь',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Ոչ հայկական ազգային նվագարաններ',
    originalLanguage: 'am',
    priority: 5,
    translations: [
      {
        name: 'Non-armenian national orchestras',
        languageCode: 'en',
      },
      {
        name: 'Не Армянские национальные инструменты',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Ակորդեոն',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Accordion',
            languageCode: 'en',
          },
          {
            name: 'Аккордеон',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Դհոլ / Զարբ / Դափ',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Dhol / Zarb / Dap',
            languageCode: 'en',
          },
          {
            name: 'Доол / Зарб / Дап',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Կախոն /Բուբեն',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Cajon / Tambourine',
            languageCode: 'en',
          },
          {
            name: 'Кахон / Бубен',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Կանկլես',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Kankles',
            languageCode: 'en',
          },
          {
            name: 'Канклес',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'այլ',
        originalLanguage: 'am',
        priority: 5,
        translations: [
          {
            name: 'others',
            languageCode: 'en',
          },
          {
            name: 'другие',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Վոկալ',
    originalLanguage: 'am',
    priority: 6,
    translations: [
      {
        name: 'Vocals',
        languageCode: 'en',
      },
      {
        name: 'Вокал',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Ակադեմիայան, էստրադային և ջազային երգեցողություն կենդանի նվագակցությամբ',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Academic, pop and jazz singing with live accompaniment',
            languageCode: 'en',
          },
          {
            name: 'Академическое, эстрадное и джазовое пение под живой аккомпанимент',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Էստրադային և ջազային երգեցողություն մինուսային հնչյունագրով',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Pop and jazz singing by audio track',
            languageCode: 'en',
          },
          {
            name: 'Эстрадное и джазовое пение под минусовую фонограмму',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ժողովրդական, աշուղական և հայրենասիրական երգ կենդանի նվագակցությամբ',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Folk, ashugh and patriotic songs with live accompaniment',
            languageCode: 'en',
          },
          {
            name: 'Народная, ашугская и патриотическая песня под живой аккомпанимент',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ժողովրդական, աշուղական և հայրենասիրական մինուսային հնչյունագրով',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Folk, ashugh and patriotic songs by audio track',
            languageCode: 'en',
          },
          {
            name: 'Народная, ашугская и патриотическая песня  под минусовую фонограмму',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հոգևոր երգ կենդանի նվագակցությամբ',
        originalLanguage: 'am',
        priority: 5,
        translations: [
          {
            name: 'Spiritual song with live accompaniment',
            languageCode: 'en',
          },
          {
            name: 'Духовная песня под живой аккомпанимент',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հոգևոր երգ մինուսային հնչյունագրով',
        originalLanguage: 'am',
        priority: 6,
        translations: [
          {
            name: 'Spiritual song by audio track',
            languageCode: 'en',
          },
          {
            name: 'Духовная песня под минусовую фонограмму',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հեղինակային երգ կենդանի նվագակցությամբ',
        originalLanguage: 'am',
        priority: 7,
        translations: [
          {
            name: "Author's song with live accompaniment",
            languageCode: 'en',
          },
          {
            name: 'Авторская песня под живой аккомпанимент',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հեղինակային երգ մինուսային հնչյունագրով',
        originalLanguage: 'am',
        priority: 8,
        translations: [
          {
            name: "Author's song by audio track",
            languageCode: 'en',
          },
          {
            name: 'Авторская песня под минусовую фонограмму',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ռոմանս կենդանի նվագակցությամբ',
        originalLanguage: 'am',
        priority: 9,
        translations: [
          {
            name: 'Романс под живой аккомпанимент',
            languageCode: 'en',
          },
          {
            name: 'Романс под живой аккомпанимент',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ռոմանս մինուսային հնչյունագրով',
        originalLanguage: 'am',
        priority: 10,
        translations: [
          {
            name: 'Romance by audio track',
            languageCode: 'en',
          },
          {
            name: 'Романс под минусовую фонограмму',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Երաժշտական համույթներ (խմբեր)',
    originalLanguage: 'am',
    priority: 7,
    translations: [
      {
        name: 'Musical ensembles (groups)',
        languageCode: 'en',
      },
      {
        name: 'Музыкальные ансамбли (группы)',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Դասական նվագարանների համույթ (առանց խմբավարի)',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Ensemble of classical instruments (without conductor)',
            languageCode: 'en',
          },
          {
            name: 'Ансамбль классических инструментов (без дирижера)',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Դասական նվագարանների նվագախումբ (խմբավարով)',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Orchestra of classical instruments (without conductor)',
            languageCode: 'en',
          },
          {
            name: 'Դասական նվագարանների նվագախումբ (խմբավարով)\tОркестр классических инструментов (без дирижера)',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ազգային նվագարանների համույթ (առանց խմբավարի)',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Ensemble of folk instruments (without conductor)',
            languageCode: 'en',
          },
          {
            name: 'Ансамбль народных инструментов (без дирижера)',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ազգային նվագարանների համույթ (խմբավարով)',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Orchestra of folk instruments (without conductor)',
            languageCode: 'en',
          },
          {
            name: 'Оркестр народных инструментов (без дирижера)',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ջազ-բենդ (խմբավարով)',
        originalLanguage: 'am',
        priority: 5,
        translations: [
          {
            name: 'Jazz band',
            languageCode: 'en',
          },
          {
            name: 'Джаз-бенд',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Խառը համույթ (առանց խմբավարի)',
        originalLanguage: 'am',
        priority: 6,
        translations: [
          {
            name: 'Mixed ensemble',
            languageCode: 'en',
          },
          {
            name: 'Смешанный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Վոկալ համույթ կենդանի նվագակցությամբ (առանց խմբավարի)',
        originalLanguage: 'am',
        priority: 7,
        translations: [
          {
            name: 'Vocal ensemble',
            languageCode: 'en',
          },
          {
            name: 'Вокальный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Երգչախումբ (խմբավարով)',
        originalLanguage: 'am',
        priority: 8,
        translations: [
          {
            name: 'Choir',
            languageCode: 'en',
          },
          {
            name: 'Хор',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Թատերական արվեստ',
    originalLanguage: 'am',
    priority: 8,
    translations: [
      {
        name: 'Theater art',
        languageCode: 'en',
      },
      {
        name: 'Театральное искусство',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Ասմունք',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Declamation',
            languageCode: 'en',
          },
          {
            name: 'Декламация',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Թատերական էտյուդ',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'Theatrical sketch',
            languageCode: 'en',
          },
          {
            name: 'Театральный этюд',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Թատերական ներկայացում',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Theatrical performance',
            languageCode: 'en',
          },
          {
            name: 'Театральная постановка',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Մյուզիքլ',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Musical',
            languageCode: 'en',
          },
          {
            name: 'Мюзикл',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Պարարվեստ',
    originalLanguage: 'am',
    priority: 9,
    translations: [
      {
        name: 'Dance art',
        languageCode: 'en',
      },
      {
        name: 'Танцевальное искусство',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Դասական մենապար',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Classic solo dance',
            languageCode: 'en',
          },
          {
            name: 'Классический соло таняец',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ժողովրդական մենապար',
        originalLanguage: 'am',
        priority: 2,
        translations: [
          {
            name: 'National solo dance',
            languageCode: 'en',
          },
          {
            name: 'Национальный соло таняец',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Սպորտային մենապար',
        originalLanguage: 'am',
        priority: 3,
        translations: [
          {
            name: 'Sports solo dance',
            languageCode: 'en',
          },
          {
            name: 'Спортивный соло таняец',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ժամանակակից մենապար',
        originalLanguage: 'am',
        priority: 4,
        translations: [
          {
            name: 'Modern solo dancer',
            languageCode: 'en',
          },
          {
            name: 'Современный соло таняец',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հիփ-հոփ / սթրիթ դանս մենապար',
        originalLanguage: 'am',
        priority: 5,
        translations: [
          {
            name: 'Hip-hop / Street dance solo dance',
            languageCode: 'en',
          },
          {
            name: 'Хип-хоп / стрит данс соло таняец',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Դասական պարային համույթ',
        originalLanguage: 'am',
        priority: 6,
        translations: [
          {
            name: 'Classical dance ensemble',
            languageCode: 'en',
          },
          {
            name: 'Классический танцевальный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ժողովրդական պարային համույթ',
        originalLanguage: 'am',
        priority: 7,
        translations: [
          {
            name: 'National dance ensemble',
            languageCode: 'en',
          },
          {
            name: 'Национальный танцевальный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ազգագրական պարային համույթ',
        originalLanguage: 'am',
        priority: 8,
        translations: [
          {
            name: 'Folklore dance ensemble',
            languageCode: 'en',
          },
          {
            name: 'Фольклорный танцевальный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Սպորտային պարային համույթ',
        originalLanguage: 'am',
        priority: 9,
        translations: [
          {
            name: 'Sports dance ensemble',
            languageCode: 'en',
          },
          {
            name: 'Спортивный танцевальный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Ժամանակակից պարային համույթ',
        originalLanguage: 'am',
        priority: 10,
        translations: [
          {
            name: 'Modern dance ensemble',
            languageCode: 'en',
          },
          {
            name: 'Современный танцевальный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
      {
        name: 'Հիփ-հոփ / սթրիթ դանս պարային համույթ',
        originalLanguage: 'am',
        priority: 11,
        translations: [
          {
            name: 'Hip-hop / Street dance Ensemble',
            languageCode: 'en',
          },
          {
            name: 'Хип-хоп / стрит данс танцевальный ансамбль',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Գեղարվեստ',
    originalLanguage: 'am',
    priority: 10,
    key: 'PAINTING',
    translations: [
      {
        name: 'Fine art',
        languageCode: 'en',
      },
      {
        name: 'Изобразительное искусство',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Գեղանկար',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Painting',
            languageCode: 'en',
          },
          {
            name: 'Живопись',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
  {
    name: 'Դեկորատիվ-կիրառական արվեստ',
    originalLanguage: 'am',
    priority: 11,
    key: 'CRAFT',
    translations: [
      {
        name: 'Decorative art',
        languageCode: 'en',
      },
      {
        name: 'Декоративное исскуство',
        languageCode: 'ru',
      },
    ],
    subNominations: [
      {
        name: 'Դեկորատիվ-կիրառական արվեստ',
        originalLanguage: 'am',
        priority: 1,
        translations: [
          {
            name: 'Decorative art',
            languageCode: 'en',
          },
          {
            name: 'Декоративное исскуство',
            languageCode: 'ru',
          },
        ],
      },
    ],
  },
];

export default class NominationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM nomination');
    await dataSource.query('ALTER TABLE nomination AUTO_INCREMENT = 1');

    await dataSource.query('DELETE FROM sub_nomination');
    await dataSource.query('ALTER TABLE sub_nomination AUTO_INCREMENT = 1');

    await dataSource.query('DELETE FROM text_content');
    await dataSource.query('ALTER TABLE text_content AUTO_INCREMENT = 1');

    await dataSource.query('DELETE FROM translation');
    await dataSource.query('ALTER TABLE translation AUTO_INCREMENT = 1');

    const nominationRepository = dataSource.getRepository(Nomination);
    const subNominationRepository = dataSource.getRepository(SubNomination);
    const textContentRepository = dataSource.getRepository(TextContent);
    const translationRepository = dataSource.getRepository(Translation);

    const languageIds = [
      { code: 'am', id: 1 },
      { code: 'en', id: 2 },
      { code: 'ru', id: 3 },
    ];

    for (const nomination of Nominations) {
      try {
        // creating Nomination, Nomination.textContent and Nomination.translations
        const newNominationTextContent = await textContentRepository.save(
          new TextContent(),
        );
        const newNomination = await nominationRepository.save({
          name: { id: newNominationTextContent.id } as TextContent,
          priority: nomination.priority,
          key: nomination.key ?? 'KEY',
        });
        await translationRepository.save({
          translation: nomination.name,
          language: { id: 1 } as Language,
          textContent: { id: newNominationTextContent.id } as TextContent,
        });

        nomination.translations.map(async (translation) => {
          await translationRepository.save({
            translation: translation.name,
            language: {
              id: languageIds.find(
                (languageId) => languageId.code === translation.languageCode,
              ).id,
            } as Language,
            textContent: { id: newNominationTextContent.id } as TextContent,
          });
        });

        // creating SubNomination, SubNomination.textContent and SubNomination.translations
        nomination.subNominations.map(async (subNomination) => {
          const newSubNominationTextContent = await textContentRepository.save(
            new TextContent(),
          );

          await translationRepository.save({
            translation: subNomination.name,
            language: { id: 1 } as Language,
            textContent: { id: newSubNominationTextContent.id } as TextContent,
          });

          subNomination.translations.map(async (translation) => {
            await translationRepository.save({
              translation: translation.name,
              language: {
                id: languageIds.find(
                  (languageId) => languageId.code === translation.languageCode,
                ).id,
              } as Language,
              textContent: newSubNominationTextContent,
            });
          });
          await subNominationRepository.save({
            name: {
              id: newSubNominationTextContent.id,
            } as TextContent,
            nomination: { id: newNomination.id } as Nomination,
            priority: subNomination.priority,
          });
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
