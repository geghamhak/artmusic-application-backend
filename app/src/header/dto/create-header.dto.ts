import { IsOptional } from 'class-validator';
import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';
import { HasMimeType, IsFile } from 'nestjs-form-data';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

export class CreateHeaderDto {
  bannerTitle: CreateTextContentDto[];
  @IsOptional()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  banner: FileSystemStoredFile;
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  logo: FileSystemStoredFile;
}
