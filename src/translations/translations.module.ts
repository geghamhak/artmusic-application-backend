import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Translation } from './entities/translation.entity';
import { TextContent } from './entities/textContent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language, Translation, TextContent])],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TypeOrmModule],
})
export class TranslationsModule {}
