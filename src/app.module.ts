import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationsModule } from './translations/translations.module';
import { CountriesModule } from './countries/countries.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CountriesService } from "./countries/countries.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
    TranslationsModule,
    CountriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, CountriesService],
})
export class AppModule {}
