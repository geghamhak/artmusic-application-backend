import { HasMimeType, IsFile } from 'nestjs-form-data';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';
import { IsOptional } from 'class-validator';
import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';

export class CreateFestivalImageDto {
  title: CreateTextContentDto[];
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  image: FileSystemStoredFile;
  @IsOptional()
  subNominationId?: string;
}
