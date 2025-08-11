import { IsOptional, ValidateNested } from 'class-validator';
import { CreateTextContentDto } from '../../translations/dto/create-text-content.dto';
import { HasMimeType, IsFile } from 'nestjs-form-data';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';
import { CreateFestivalConfigDto } from '../../festival-config/dto/create-festival-config.dto';
import { CreateScoringItem } from '../../scoring-system/scoring-system.service';
import { IFestivalJuries } from '../festivals.service';
import { ValidateFestivalImageFilename } from '../validator/validateFestivalImageFilename';

export class CreateFestivalDto {
  type: string;
  title: CreateTextContentDto[];
  description: CreateTextContentDto[];
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  banner: FileSystemStoredFile;
  @IsFile()
  @HasMimeType(['text/plain', 'application/pdf'])
  termsAndConditions: FileSystemStoredFile;
  bannerDescription: CreateTextContentDto[];
  config?: CreateFestivalConfigDto;
  applicationEndDate?: string;
  applicationStartDate?: string;
  festivalEndDate?: string;
  festivalStartDate?: string;
  @IsFile({ each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  @IsOptional()
  @ValidateFestivalImageFilename()
  @ValidateNested({ each: true })
  gallery?: FileSystemStoredFile[];
  @IsFile()
  // @HasMimeType(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/octet-stream'], { each: true })
  @IsOptional()
  existingSchedule?: FileSystemStoredFile;
  scorePattern?: CreateScoringItem[];
  festivalJuries?: IFestivalJuries[];
}
