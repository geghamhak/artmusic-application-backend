import { IsOptional } from 'class-validator';
import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';
import { CreateTextContentDto } from 'src/translations/dto/create-text-content.dto';

export class CreateContactDto {
  information: CreateTextContentDto[];
  @IsOptional()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  images: FileSystemStoredFile[];
}
