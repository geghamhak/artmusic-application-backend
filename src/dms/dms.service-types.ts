import { FileSystemStoredFile } from 'nestjs-form-data';

export interface UploadSingleFile {
  file: FileSystemStoredFile;
  entity: string;
  entityId: number;
  type?: string;
  code?: string;
}

export interface UploadSingleFileResponse {
  url: string;
  isPublic: boolean;
  key: string;
}

export interface UploadMultipleFiles {
  files: FileSystemStoredFile[];
  entity: string;
  entityId: number;
  type?: string;
  code?: string;
}
