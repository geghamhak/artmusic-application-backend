// seeds.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Language } from '../translations/entities/language.entity';
import LanguageSeeder from './seeds/Language.seeder';
import { Translation } from '../translations/entities/translation.entity';
import { TextContent } from '../translations/entities/textContent.entity';
import { Application } from '../applications/entities/application.entity';
import { Country } from '../countries/entities/country.entity';
import { FestivalType } from '../festival-types/entities/festival-type.entity';
import { Festival } from '../festivals/entities/festival.entity';
import { Nomination } from '../nominations/entities/nomination.entity';
import { ParticipantDocument } from '../participant-documents/entities/participant-document.entity';
import { ParticipantRecording } from '../participant-recordings/entities/participant-recording.entity';
import { ParticipantVideoLink } from '../participant-video-links/entities/participant-video-link.entity';
import { Participant } from '../participants/entities/participant.entity';
import { Region } from '../regions/entities/region.entity';
import { School } from '../schools/entities/school.entity';
import { ScoringSystem } from '../scoring-system/entities/scoring-system.entity';
import { SubNomination } from '../sub-nominations/entities/sub-nomination.entity';
import NominationSeeder from './seeds/Nomination.seeder';
import { ApplicationScore } from '../application-score/entities/application-score.entity';
import RegionSeeder from './seeds/Region.seeder';
import SchoolSeeder from './seeds/School.seeder';
import FestivalTypeSeeder from './seeds/FestivalType.seeder';
import { ApplicationComposition } from '../application-composition/entities/application-composition.entity';
import CountrySeeder from './seeds/Country.seeder';
import { Header } from '../header/entities/header.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql' as const,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'artmusic',
  entities: [
    Application,
    Country,
    FestivalType,
    Festival,
    Nomination,
    ParticipantDocument,
    ParticipantRecording,
    ParticipantVideoLink,
    Participant,
    Region,
    School,
    ScoringSystem,
    SubNomination,
    Translation,
    Language,
    TextContent,
    ApplicationScore,
    ApplicationComposition,
    Header,
  ],
  seeds: [
    LanguageSeeder,
    NominationSeeder,
    RegionSeeder,
    SchoolSeeder,
    FestivalTypeSeeder,
    CountrySeeder,
  ],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
