import { IsOptional } from 'class-validator';
import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';
import { HasMimeType, IsFiles } from 'nestjs-form-data';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

export class CreateHomePageDto {
  title: CreateTextContentDto[];
  information: CreateTextContentDto[];
  @IsOptional()
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images?: FileSystemStoredFile[];
  videoLink?: string;
}
