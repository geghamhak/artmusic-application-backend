import { Module } from '@nestjs/common';
import { ParticipantVideoLinksService } from './participant-video-links.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantVideoLink } from './entities/participant-video-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantVideoLink])],
  exports: [TypeOrmModule, ParticipantVideoLinksService],
  providers: [ParticipantVideoLinksService],
})
export class ParticipantVideoLinksModule {}
