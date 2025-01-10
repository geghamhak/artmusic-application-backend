import { Module } from '@nestjs/common';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsModule } from '../translations/translations.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Header } from './entities/header.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Header]),
    TranslationsModule,
    NestjsFormDataModule,
  ],
  controllers: [HeaderController],
  providers: [HeaderService],
  exports: [TypeOrmModule, HeaderService],
})
export class HeaderModule {}
