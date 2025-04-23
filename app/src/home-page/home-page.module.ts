import { Module } from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { HomePageController } from './home-page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsModule } from '../translations/translations.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { HomePage } from './entities/home-page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomePage]),
    TranslationsModule,
    NestjsFormDataModule,
  ],
  controllers: [HomePageController],
  providers: [HomePageService],
  exports: [TypeOrmModule, HomePageService],
})
export class HomePageModule {}
