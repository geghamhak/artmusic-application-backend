import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { TranslationsModule } from 'src/translations/translations.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    TranslationsModule,
    NestjsFormDataModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [TypeOrmModule, ContactService],
})
export class ContactModule {}
