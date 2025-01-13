import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';
import { FestivalsEnum } from '../festivals.service';
import { HasMimeType, IsFile } from 'nestjs-form-data';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

export class CreateFestivalDto {
  type: FestivalsEnum;
  title: CreateTextContentDto[];
  description: CreateTextContentDto[];
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  banner: FileSystemStoredFile;
  @IsFile()
  @HasMimeType(['text/plain', 'application/pdf'])
  termsAndConditions: FileSystemStoredFile;
  bannerDescription: CreateTextContentDto[];
  applicationEndDate?: string;
  applicationStartDate?: string;
}
