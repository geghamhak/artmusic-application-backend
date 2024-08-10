import { Module } from '@nestjs/common';
import { ParticipantDocumentsService } from './participant-documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantDocument } from './entities/participant-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantDocument])],
  exports: [TypeOrmModule],
  providers: [ParticipantDocumentsService],
})
export class ParticipantDocumentsModule {}
