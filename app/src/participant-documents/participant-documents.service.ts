import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantDocument } from './entities/participant-document.entity';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

@Injectable()
export class ParticipantDocumentsService {
  constructor(
    @InjectRepository(ParticipantDocument)
    private participantDocumentRepository: Repository<ParticipantDocument>,
  ) {}

  async saveMany(
    uploadedDocuments: FileSystemStoredFile[],
  ): Promise<ParticipantDocument[]> {
    try {
      const files: Promise<ParticipantDocument>[] = uploadedDocuments.map(
        (uploadedDocument) => {
          return this.create(uploadedDocument);
        },
      );

      return await Promise.all(files);
    } catch (e) {
      throw new Error('Unable to create participant document');
    }
  }

  async create(
    uploadedDocument: FileSystemStoredFile,
  ): Promise<ParticipantDocument> {
    const file = new ParticipantDocument();
    file.originalName = uploadedDocument.originalName;
    file.originalMimeType = uploadedDocument.mimetype;
    return await this.participantDocumentRepository.save(file);
  }
}
