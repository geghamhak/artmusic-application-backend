import { FileSystemStoredFile } from 'nestjs-form-data';

export interface UploadSingleFile {
  file: FileSystemStoredFile;
  entity: string;
  entityId: number;
  type?: string;
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
}
