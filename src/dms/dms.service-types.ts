export interface UploadSingleFile {
  file: Express.Multer.File;
  entity: string;
  entityId: string;
  type?: string;
}

export interface UploadSingleFileResponse {
  url: string;
  isPublic: boolean;
  key: string;
}

export interface UploadMultipleFiles {
  files: Express.Multer.File[];
  entity: string;
  entityId: string;
  type?: string;
}
