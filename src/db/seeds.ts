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
import { SubNomination } from '../sub-nominations/entities/sub-nomination.entity';
import NominationSeeder from './seeds/Nomination.seeder';
import { ApplicationScore } from '../application-score/entities/application-score.entity';
import RegionSeeder from './seeds/Region.seeder';
import SchoolSeeder from './seeds/School.seeder';
import FestivalTypeSeeder from './seeds/FestivalType.seeder';
import { ApplicationComposition } from '../application-composition/entities/application-composition.entity';
import CountrySeeder from './seeds/Country.seeder';
import { Header } from '../header/entities/header.entity';
import { HomePage } from '../home-page/entities/home-page.entity';
import { Contact } from '../contact/entities/contact.entity';
import { StaffPage } from '../staff-page/entities/staff-page.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Jury } from '../juries/entities/jury.entity';
import { FestivalJury } from '../festival-jury/entities/festival-jury.entity';
import { FestivalConfig } from '../festival-config/entities/festival-config.entity';
import * as process from 'node:process';
import { Admin } from '../admin/entities/admin.entity';
import AdminSeeder from './seeds/Admin.seeder';
import JurySeeder from './seeds/Jury.seeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql' as const,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT as unknown as number,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
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
    SubNomination,
    Translation,
    Language,
    TextContent,
    ApplicationScore,
    ApplicationComposition,
    Header,
    HomePage,
    Contact,
    Staff,
    StaffPage,
    Jury,
    FestivalJury,
    FestivalConfig,
    Admin,
    Jury,
  ],
  seeds: [
    LanguageSeeder,
    NominationSeeder,
    RegionSeeder,
    SchoolSeeder,
    CountrySeeder,
    AdminSeeder,
    JurySeeder,
    FestivalTypeSeeder,
  ],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
