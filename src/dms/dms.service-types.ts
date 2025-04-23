import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

export interface UploadSingleFile {
  file: FileSystemStoredFile;
  entity: string;
  entityId: string;
  isPublic: boolean;
}

export interface UploadSingleFileResponse {
  url: string;
  isPublic: boolean;
  key: string;
}

export interface UploadMultipleFiles {
  files: FileSystemStoredFile[];
  entity: string;
  entityId: string;
  isPublic: boolean;
}
