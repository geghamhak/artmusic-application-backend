import { forwardRef, Module } from '@nestjs/common';
import { FestivalImagesService } from './festival-images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsModule } from '../translations/translations.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DmsModule } from '../dms/dms.module';
import { FestivalImage } from './entities/festival-image.entity';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FestivalImage]),
    TranslationsModule,
    NestjsFormDataModule,
    forwardRef(() => ApplicationsModule),
    DmsModule,
  ],
  exports: [TypeOrmModule, FestivalImagesService],
  providers: [FestivalImagesService],
})
export class FestivalImagesModule {}
