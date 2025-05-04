import { Module } from '@nestjs/common';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsModule } from '../translations/translations.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Header } from './entities/header.entity';
import { DmsModule } from 'src/dms/dms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Header]),
    TranslationsModule,
    NestjsFormDataModule,
    DmsModule,
  ],
  controllers: [HeaderController],
  providers: [HeaderService],
  exports: [TypeOrmModule, HeaderService],
})
export class HeaderModule {}
