import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';
import { HasMimeType, IsFiles } from 'nestjs-form-data';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

export class CreateHomePageDto {
  title: CreateTextContentDto[];
  information: CreateTextContentDto[];
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'])
  images?: FileSystemStoredFile[];
  videoLink?: string;
}
