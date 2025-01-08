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
  async create(
    uploadedDocuments: FileSystemStoredFile[],
  ): Promise<ParticipantDocument[]> {
    try {
      const files: ParticipantDocument[] = [];
      uploadedDocuments.map(async (uploadedDocument) => {
        const file = this.participantDocumentRepository.create();
        file.originalName = uploadedDocument.originalName;
        file.originalMimeType = uploadedDocument.mimetype;
        await this.participantDocumentRepository.save(file);
        files.push(file);

        // add to AWS S3
      });

      return files;
    } catch (e) {
      throw new Error('Unable to create participant document');
    }
  }
}
