import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ParticipantDocument } from "./entities/participant-document.entity";
import { CreateParticipantDocumentDto } from "./dto/create-participant-document.dto";

@Injectable()
export class ParticipantDocumentsService {
  constructor(
    @InjectRepository(ParticipantDocument)
    private participantDocumentRepository: Repository<ParticipantDocument>,
  ) {}
  create(createParticipantDocumentDtos: CreateParticipantDocumentDto[]) {
    try {
      const files = [];
      createParticipantDocumentDtos.map((createParticipantDocumentDto) => {
        const file =  this.participantDocumentRepository.create();
        // add to AWS S3
        files.push(file);
      });

      return files;
    } catch (e) {
      throw new Error('Unable to create participant document');
    }
  }
}
