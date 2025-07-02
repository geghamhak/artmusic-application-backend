import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';
import { HasMimeType, IsFile } from 'nestjs-form-data';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

export class CreateStaffDto {
  name: CreateTextContentDto[];
  description: CreateTextContentDto[];
  isActive: boolean;
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  image: FileSystemStoredFile;
}
